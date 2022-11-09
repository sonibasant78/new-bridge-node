const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2")

var messageSchema = new mongoose.Schema({
  chatChannel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatChannel",
  },
  message: {
    type: String,
    required: "reciever_id can't be empty",
    default: ""
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "sender_id can't be empty",
    default: ""
  },
  reciever_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "reciever_id can't be empty",
    default: ""
  },
  reaction_emoji_unicodes: {
    type: Array,
    default: [],
  }
},
  { timestamps: true }
);

messageSchema.plugin(aggregatePaginate);

mongoose.model("Message", messageSchema);
