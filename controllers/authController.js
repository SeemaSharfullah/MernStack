const User =require ("../models/userModel.js");
const bcryptjs =require ("bcryptjs");
const { errorHandler } =require ("../middleware/error.js");
const jwt =require ("jsonwebtoken");
const bcrypt = require('bcrypt')
const JWT_SECRET='JWTSECRET'
const LikeSchema=require('../models/propertyLike.js')
const BookSchema=require('../models/booking.js')
const FeedbackSchema=require('../models/feedback.js')
 const signup = async (req, res, next) => {
  console.log('Signup request received:', req.body);
  try{
    const {username,email,phone, password,role} = req.body; //from front end
    
    const profileImage = req.file?.filename;
    console.log("req.file:", req.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User with this email already exists.");
      return res.status(400).json({ message: 'User with this email already exists.' });
      
    }
    
    const salt = await bcrypt.genSalt(10)
    const secpass = await bcrypt.hash(password, salt) 
    
   
    const data =  new User ({profileImage:profileImage,username:username, email:email,phone:phone,
    password:secpass,role:role});//extract the data from url
    const savedRegister = await data.save();//to store the da ta to mongodb
    console.log("Insertion successful")
    res.send({"Insertion successful":true, savedRegister});
// }
}
catch (error) {
  if (error.code === 11000) {
   
    return res.status(400).json({ message: 'User with this email already exists.' });
   
  }
  console.log("User with this email already exists.");
  console.error('Error during user registration:', error);
  res.status(500).json({ message: 'Internal server error.' });
}
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findLogin = await User.findOne({ email });

    if (!findLogin) {
      return res.json({ message: 'Email not found' });
     
    }

    const isMatch = await bcrypt.compare(password, findLogin.password);

    if (!isMatch) {
      return res.json({ message: 'Password not matched' });
     
    }

    const IDdata = findLogin.id;

   
    const token = jwt.sign({ id: IDdata }, JWT_SECRET,{ expiresIn: '1h' });

    const success = true;
    res.json({ success, token, findLogin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
};
 const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

 const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};





const AddToFavorites= async (req, res) => {
  try {
    const { property_id, user_id } = req.body;
    console.log(property_id,'sdfghjk');
    console.log(user_id,'fjf,kfug');
    const user = await User.find({ user_id:req.body.user_id });
    console.log(user);
   
      let newLike=new LikeSchema({ property_id, user_id });
      const savedLike = await newLike.save();
      res.json(savedLike);
    
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// userRoutes.js


// Express route to get favorite properties

const GetFav=async (req, res) => {
    try {
      const likedProperties = await LikeSchema.find().populate('property_id');
      // const likes = await LikeSchema.find().populate('property_id user_id');
      res.json(likedProperties);
  } catch (error) {
    console.error('Error fetching favorite properties:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const RemoveFavProperty=async (req, res) => {
  try {
    const { property_id, user_id } = req.body;

    // Find and delete the property from favorites
    const deletedLike = await LikeSchema.findOneAndDelete({ property_id, user_id });

    if (!deletedLike) {
      return res.status(404).json({ success: false, message: 'Property not found in favorites' });
    }

    res.json({ success: true, message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite property:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const Book=async(req,res)=>{
  try {
    const { propertyId, userId,bookingDate, visitMessage  } = req.body;
    console.log(propertyId,'sdfghjk');
    console.log(userId,'fjf,kfug');
   
    const user = await User.find({ userId:req.body.userId });
    console.log(user);
    // if(user==null){
      let newBook=new BookSchema({ propertyId, userId,bookingDate,
        visitMessage });
      const savedBook = await newBook.save();
      res.json(savedBook);
  } catch (error) {
    console.error('Error booking property:', error);
    res.status(500).send('Internal Server Error');
  }
  };

  const GetBook=async (req, res) => {
    try {
      const BookedProperties = await BookSchema.find({ status: 'pending' }).populate('propertyId');
      // const likes = await LikeSchema.find().populate('property_id user_id');
      res.json(BookedProperties);
  } catch (error) {
    console.error('Error fetching booked properties:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const RemoveBookproperty=async (req, res) => {

try {
  const { propertyId,status } = req.body;
  console.log(req.body);
  
  // Find the booking in the database
  const booking = await BookSchema.findById(propertyId);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  // Update the status to 'canceled'
  booking.status = 'canceled';

  

  // Save the updated booking to the database
  await booking.save();

  // Respond with success
  res.json({ success: true, message: 'Booking canceled successfully' });
} catch (error) {
  console.error('Error canceling booking:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
}
};


const ViewBooks = async(req, res)=>{
  try {
    const BookedProperties = await BookSchema.find().populate('propertyId').populate('userId');
   
    console.log(BookedProperties);
    res.json(BookedProperties);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

const handleBookingAction = async (req, res) => {
  const { bookingId, action } = req.body;

  try {
    let adminStatus = ''; // Initialize adminStatus variable

    // Set adminStatus based on the action
    if (action === 'accept') {
      adminStatus = 'accepted';
    } else if (action === 'reject') {
      adminStatus = 'rejected';
    } else {
      // Handle invalid action (if needed)
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Update the booking's adminStatus directly
    const updatedBooking = await BookSchema.findByIdAndUpdate(
      bookingId,
      { adminStatus },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      throw new Error('Booking not found');
    }

    res.json({ message: 'Booking status updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

let bookings = [];

const BookRemove = async (req, res) => {
  try {
    const { bookingId } = req.body; // Assuming bookingId is a property of req.body
    // Your deletion logic here, using the correct `_id` value
    const deletedBooking = await BookSchema.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(204).send(); // No content after successful deletion
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

// Example route to get booked properties for a user
 
const GetUserBook=async (req, res) => {
  try {
    
    const user = await User.findById(userId).populate('bookedProperties');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookedProperties = user.bookedProperties.map(property => property._id.toString());
    res.json({ data: bookedProperties });
  } catch (error) {
    console.error('Error retrieving booked properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const CreateFeed=async (req, res) => {
  
  try {
    const  {feedback,userId } = req.body;
    const user = await User.find({ userId:req.body.userId });
    console.log(user);
    const newFeedback = new FeedbackSchema({ feedback,userId });
    await newFeedback.save();
    res.json({ success: true, message: 'Feedback received successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving feedback.' });
  }
};


const ViewBack = async(req, res)=>{
  try {
    const Feedback = await FeedbackSchema.find().populate('userId');
   
    console.log(Feedback);
    res.json(Feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}



const BackRemove = async (req, res) => {
  console.log(req.body);

  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: 'Missing feedback ID in the request body' });
    }

    // Your deletion logic here, using the correct `_id` value
    const deletedFeedback = await FeedbackSchema.findByIdAndDelete(feedback);

    if (!deletedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.status(204).send(); // No content after successful deletion
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  
module.exports={signup,signin,google,signout,AddToFavorites,GetFav,RemoveFavProperty,Book,GetBook,RemoveBookproperty,ViewBooks,GetUserBook,handleBookingAction,BookRemove,CreateFeed,ViewBack,BackRemove}