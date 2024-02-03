const mongoose=require('mongoose');

const BookSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
      },
      bookingDate: {
        type: Date,
        required: false,
      },
      visitMessage:{
        type:String,
        required:false,
      },
      status:{
        type: String,
        // enum: [ 'canceled', 'pending'], // Add more status values if needed
        default: 'pending',
      },
      adminStatus:{
type:String,
default:''
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },}
);

module.exports = mongoose.model("Booking", BookSchema);