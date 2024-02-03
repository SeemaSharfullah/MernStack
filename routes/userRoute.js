const express= require("express");
const {
  deleteUser,
  getUser,
  
 updateUser,
  test,

  ViewUsers,
  CreateFeed,
  GetFeedBack
} =require("../controllers/userController.js");
const  verifyToken  =require("../middleware/verifyUser.js");

const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/update/:id",verifyToken, upload.single('profileImage'), updateUser);
router.get("/test", test);

router.delete("/delete/:id",verifyToken, deleteUser);

router.get("/:id",verifyToken, getUser);
router.get("/",verifyToken,ViewUsers);

module.exports = router;