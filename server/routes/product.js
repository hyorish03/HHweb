const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const multer = require('multer'); 
//=================================
//             Product
//=================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage }).single("files");


router.post('/image', (req, res) => {
    //가져온 이미지를 저장해주면 된다.
    upload(req, res, err => {
        if(err) {
          console.log(err)
            return res.json({success:false, err})
        }
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.name})
    })
})

module.exports = router;
 