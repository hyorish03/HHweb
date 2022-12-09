const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const {Product} = require("../models/Product")

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp, {
          sameSite: "none",
          secure: true,
        });
        res
          .cookie("w_auth", user.token, {
            sameSite: "none",
            secure: true,
          })
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id,
          });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

router.post("/addToCart", auth, (req, res) => {

  //먼저 User collection에 해당 유저의 정보를 가져오기
  User.findOne({_id: req.user._id },
    (err, userInfo) => {

      //가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는 확인
      let duplicate = false;
      userInfo.cart.forEach((item) => {
        if(item.id === req.body.productId){
          duplicate = true;
        }
      })
      //상품이 이미 있을때 -> 상품갯수만 1 올리기
      if(duplicate){
        User.findOneAndUpdate(
            {_id: req.user._id, "cart.id" :req.body.productId },
            //사람 먼저 잡고, 상품을 잡는 구조
            {$inc : {"cart.$.quantity": 1}},
            {new : true},
            (err, userInfo) => {
              if(err) return res.status(200).json({success: false, err })
              res.status(200).send(userInfo.cart) //에러가 없으면 프론트엔드에 cart정보를 보내준다.
            }
            )

      }
      //상품이 없을때
      else{
        User.findOneAndUpdate(
          {_id: req.user._id},
          {
            $push: {
              cart: {
                id: req.body.productId,
                quantity: 1,
                data: Date.now()
              }
            }
          },
          {new : true},
          (err, userInfo) => {
            if(err) return res.status(400).json({success: false, err })
            res.status(200).send(userInfo.cart)
          }
        )

      }

    })
  
  
});

router.get('/removeFromCart', auth, (req, res) => {
  //먼저 cart안에 내가 지우려고 한 상품을 지워주기->id를 기준으로
  User.findOneAndUpdate(
    { _id: req.user._id },
    {//넣을때는 push, 뺄때는 pull이용!
        "$pull":
            { "cart": { "id": req.query.id } }
    },
    { new: true }, //updata된 값을 가지기 위해서 추가!(cart에서 id가 빠진 userInfo)
    (err, userInfo) => {
        let cart = userInfo.cart;
        let array = cart.map(item => {
            return item.id
        })
        //product collection에서  현재 남아있는 상품들의 정보를 가져오기
        //route의 product.js에서 DB에서 id가 같은 상품 가져오기와 같은 원리!
        //지워지지 않은 남은 id들

        //productInfo랑 cart정보를 넣어주는 이유는, detail에만 있는 quatitiy정보때문 
        Product.find({ _id: { $in: array } })
            .populate('writer')
            .exec((err, productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
    }
) //프론트앤드에 정보를 넘기면, user_action에서




  //그 후 User Data의 cartDetail에서도 정보도 다시 가져와야한다.


})

module.exports = router;
