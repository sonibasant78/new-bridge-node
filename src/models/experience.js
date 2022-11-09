const mongoose = require("mongoose");

var experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "userId can't be empty",
    default:""
  },
  title: {
    type: String,
    default:""
  },
  employment: {
    type: String,
    default:""
  },
  company: {
    type: String,
    default:""
  },
  location: {
    type: String,
    default:""
  },
  startMonth: {
    type: String,
    default:""
  },
  startYear: {
    type: String,
    default:""
  },
  endMonth: {
    type: String,
    default:""
  },
  endYear: {
    type: String,
    default:""
  },
 
},
{ timestamps: true }
);

mongoose.model("Experience", experienceSchema);
