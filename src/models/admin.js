const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var adminSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: "Full name can't be empty",
    },
    lastname: {
      type: String,
      required: "lastname can't be empty",
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
      default:" ",
    },
    token: {
      type: String,
    },
    saltSecret: String,
  },
  { timestamps: true }
);

// Custom validation for email
adminSchema.path("email").validate((val) => {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");



if(password = !null){
  // Events
  adminSchema.pre("save", function (next) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        this.saltSecret = salt;
        next();
      });
    });
  });

  //for comparing the users entered password with database duing login
adminSchema.methods.comparePassword = function (candidatePassword, callBack) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callBack(err);
    callBack(null, isMatch);
  });
};
}




module.exports = mongoose.model("Admin", adminSchema);
