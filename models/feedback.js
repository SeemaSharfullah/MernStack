
const mongoose = require('mongoose');


const FeedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now, // Set the default value to the current date and time
      },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);