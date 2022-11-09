const mongoose = require("mongoose");

var educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "userId can't be empty",
    default:""
  },
  business: {
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
  grade: {
    type: String,
    default:""
  },
  activities: {
    type: String,
    default:""
  }
},
{ timestamps: true }
);

mongoose.model("Education", educationSchema);
