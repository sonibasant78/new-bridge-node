const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: "Full name can't be empty",
    },
    lastname: {
      type: String,
      required: "lastname can't be empty",
    },
    username: {
      type: String,
      required: "username can't be empty",
      unique: true,
      minlength: [2, "username must be atleast 2 character long"],
    },
    email: {
      type: String,
      required: "Email can't be empty",
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      // minlength:0,
      default: "",
    },
    dateofbirth: {
      type: String,
      required: true,
    },
    schoolid: {
      type: String,
      required: true,
    },
    interests: {
      type: Array,
      default: [],
    },
    graduation: {
      type: String,
    },
    accountType: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    schoolid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    experience: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Experience",
    },
    education: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Education",
    },
    grades: {
      type: Array,
      default: [],
    },
    childrengrade: {
      type: Array,
      default: [],
    },
    token: {
      type: String,
    },
    code: {
      type: String,
    },
    saltSecret: String,
  },
  { timestamps: true }
);

// Custom validation for email
userSchema.path("email").validate((val) => {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");



if (password = !null) {
  // Events
  userSchema.pre("save", function (next) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        this.saltSecret = salt;
        next();
      });
    });
  });

  //for comparing the users entered password with database duing login
  userSchema.methods.comparePassword = function (candidatePassword, callBack) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return callBack(err);
      callBack(null, isMatch);
    });
  };
}




module.exports = mongoose.model("User", userSchema);
