const mongoose = require("mongoose");

var bridgedUserSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "reciever_id can't be empty",
    default:""
  },
  bridgeduserid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "reciever_id can't be empty",
    default:""
  }
},
{ timestamps: true }
);

mongoose.model("BridgedUser", bridgedUserSchema);
