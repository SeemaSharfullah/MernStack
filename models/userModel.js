const mongoose=require ("mongoose");

const userSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
     requiired:true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
   phone:{
    type:Number,
    required: true,
   },
    password: {
      type: String,
      required: true,
    },
    role:{
    type:Number,
      default:0,
      required:false
    }
    
   
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

