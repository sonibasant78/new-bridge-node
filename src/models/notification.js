const mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "userId can't be empty",
    default:""
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "userId can't be empty",
    default:""
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: "messageid can't be empty",
    default:""
  },
  isSeen:{
    type: Boolean,
    default:false
  }
},
{ timestamps: true }
);

mongoose.model("Notification", notificationSchema);
