const mongoose = require("mongoose");

var chatChannelSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "sender_id can't be empty",
    default:""
  },
  reciever_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "reciever_id can't be empty",
    default:""
  }
},
{ timestamps: true }
);

mongoose.model("ChatChannel", chatChannelSchema);
