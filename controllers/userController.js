


const bcryptjs=require ("bcryptjs");
const User = require('../models/userModel.js')
const Property = require('../models/listingModel.js');
const Like=require('../models/propertyLike.js')
const Feedback=require('../models/feedback.js')
 const test = (req, res) => {
  res.json({
    message: "API route is working!",
  });
};




const updateUser = async (req, res, next) => {
  try {
    const { username, email,phone, password } = req.body;
    let profileImage = ''

    if(req.file){
       profileImage = req.file.filename
    }
    const newdata = {};
    if(profileImage){newdata.profileImage=profileImage}
    if (username) newdata.username = username;
    if (email) newdata.email = email;
    if (email) newdata.phone = phone;
    if (password) newdata.password = password;
    
    
   
    

    let data = await User.findById(req.params.id);

    if (!data) {
      console.log("Data is not found with this ID");
      return res.status(404).send("Data does not exist with this ID");
    } else {
      data = await User.findByIdAndUpdate(req.params.id, { $set: newdata }, { new: true });

      if (!data) {
        return res.status(404).json({ error: 'Listing not found!' });
      }

      res.json(data);
    }
  } catch (error) {
    console.error("Some error occurred", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 const deleteUser = async (req, res, next) => {
  // if (req.user.id !== req.params.id)
  //   return next(errorHandler(401, "You can only delete your own account!"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};



 const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

const ViewUsers = async(req, res)=>{
  try {
    const data = await User.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}


 




module.exports={test,updateUser,deleteUser,getUser,ViewUsers}