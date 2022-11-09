const mongoose = require("mongoose");
const UserSchema = mongoose.model("User");

const CommonMiddleware = {
  isToken: async (req, res, next) => {
    let user = new UserSchema();
    let token = req.headers.authorization;

    if (!token) {
      return res.send("token must be compulsory")
    }

    token = token.split(" ")[1].trim();

    if (!token) {
      return res.status(403).json("Authorization Failed");
    }

    let userData = await UserSchema.findOne({ token: token });

    if (!userData) {
      return res.status(400).json({ message: "Authorisation failed" });
    }
    next();
  },
  callback: async (req, res, next) => {
    console.log("ho gaya");
  },
};

module.exports = CommonMiddleware;
