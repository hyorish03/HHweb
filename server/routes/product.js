const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const { Product } = require("../models/Product");
const { json } = require("body-parser");
const {Axios} = require("axios");
//=================================
//             Product
//=================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("files");

router.post("/image", (req, res) => {
  //가져온 이미지를 저장해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.name });
  });
});

router.post("/", (req, res) => {
  //받아온 정보들을 DB에 넣어 준다.\
  const product = new Product(req.body);
  product.save((err) => {
    console.log(err);
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  //product collection에 들어있는 모든 상품 정보들 가져오기
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log("key", key);

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .populate("writer")
    .skip(skip)
    .limit(limit)
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, productInfo, postSize: productInfo.length });
    });
});

//-------------------------------------------------------

router.get("/products_by_id", (req, res) => {
  
  let type = req.query.type
  let productIds = req.query.id
  //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.

  //type이 array일때, -> id =123, 456, 8888,666를
  if(type === "array") {


    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
      return item
    })
  }
  //productIds=['123', '456', '8888', '666']로 바꿔줘야한다.


  //1개 넣어줄때 {_id: productIds} / 여러개 넣어줘야 할때(카트에 담긴 여러개의 상품을 불러올 때) {_id: {$in: productIds}}을 이용해 준다.
  Product.find({_id: {$in: productIds}})
    .populate('writer')
    .exec((err, product) => {
      if(err) return res.status(400).send(err)
      return res.status(200).send(product)
    })

});

//Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
/*
router.delete("/products_by_id", (req, res) => {
  let productIds = req.query.id

  Product.deleteOne({ _id: productIds }).then(res.status(200).json({})).catch(res.status());
});
*/


module.exports = router;