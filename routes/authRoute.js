const express =require ("express");
const {
  google,
  signin,
  signout,
  signup,
  AddToFavorites,
  GetFav,
  RemoveFavProperty,
  Book,
  GetBook,
  RemoveBookproperty,
  ViewBooks,
  GetUserBook,
  handleBookingAction,
  BookRemove,
  CreateFeed,
  ViewBack,
  BackRemove,
  
} =require("../controllers/authController.js");
const  verifyToken = require("../middleware/verifyUser.js");

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
router.post("/signup",upload.single('profileImage'), signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.post('/addToFavorites',verifyToken,AddToFavorites)
router.get('/getFavoriteProperties', verifyToken,GetFav)
router.delete('/removeFromFavorites',verifyToken,RemoveFavProperty)
router.post('/addToBook',verifyToken,Book)
router.get('/getBook',verifyToken,GetBook)
router.patch('/removeBook/:id',verifyToken,RemoveBookproperty)
router.get("/",verifyToken,ViewBooks);
router.get('getBooks/:userId',GetUserBook)
router.put('/handleBookingAction',verifyToken,handleBookingAction)
router.delete('/deleteBooking',verifyToken,BookRemove)
router.post('/feedback',verifyToken,CreateFeed)
router.get("/backget",verifyToken,ViewBack)
router.delete("/deletefeedback/:id",verifyToken,BackRemove)
module.exports= router;