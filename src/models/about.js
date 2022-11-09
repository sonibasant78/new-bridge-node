const mongoose = require("mongoose");

var aboutSchema = new mongoose.Schema({
  about: {
    type: String,
    required: "Full name can't be empty",
    unique: true,
  },
});

mongoose.model("About", aboutSchema);
