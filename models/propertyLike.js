const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const LikeSchema=new mongoose.Schema({
    property_id:
    
        {type:mongoose.Schema.Types.ObjectId,ref:"Listing",required:true}
    
,
    user_id:
        {type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
    ,
},{
    timestamps:true,
}
);

module.exports = mongoose.model("Like", LikeSchema);