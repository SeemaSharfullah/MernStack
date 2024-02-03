const express =require("express") ;
const {
  createListing,
  deleteListing,
  
  getListing,
  updateListing,
  getSingleList,
  Search,
  Like,
  Dislike,
  Token,
  getLikedProperties
} =require("../controllers/listingController.js") ;

const verifyToken =require('../middleware/verifyUser.js')



const router = express.Router();




// router.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

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

// Use upload.array('images') middleware in your route handling the file upload

router.get('/protected-route', Token)

router.post('/create',verifyToken,upload.array('images',4),createListing )

router.delete("/delete/:id",verifyToken,deleteListing);
router.put('/update/:id', verifyToken,upload.array('images',4), updateListing);
router.get("/get", getListing);
router.get('/sget/:id',getSingleList);
router.get('/getsearch',Search)







module.exports= router;