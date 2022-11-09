const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const Joi = require("joi");
const UserSchema = mongoose.model("User");
const secretKey = "bridge";
const axios = require("axios");

const AuthControllers = {
  register: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
      grades: Joi.array(),
      childrengrade: Joi.array(),
      firstname: Joi.string().required().label("first name"),
      lastname: Joi.string().required().label("last name"),
      username: Joi.string().min(2).required().label("username"),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .label("email"),
      image: Joi.string().allow("", null),
      socialLogin: Joi.boolean().required(),
      dateofbirth: Joi.string().required().label("date of birth"),
      accountType: Joi.string().required().label("acount type"),
      schoolid: Joi.string().required().label("schoolname"),
    }).unknown(true);

    const user = new UserSchema();

    try {
      const value = await schema.validateAsync(body);
      user.grades = value.grades;
      user.childrengrade = value.childrengrade;
      user.firstname = value.firstname;
      user.lastname = value.lastname;
      user.username = value.username;
      user.email = value.email;
      if (!value.socialLogin) {
        if (!value.password) {
          res
            .status(400)
            .json({
              error: true,
              data: "password field is not allowed to be empty",
            });
        } else {
          user.password = value.password;
        }
      }
      user.dateofbirth = value.dateofbirth;
      user.graduation = value.graduation;
      user.accountType = value.accountType;
      user.schoolid = value.schoolid;
      if (value.image) {
        user.image = value.image;
      }
      user.token = jwt.sign({ user }, secretKey);
      console.log("final user object ", user);
      await user.save();
      res.json({
        error: false,
        data: user,
        message: "Registration Successful",
      });
    } catch (error) {
      console.log("register api error ", error.message);
      res.status(400).json({ error: true, message: error.message });
    }
  },

  login: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object({
      username: Joi.string().required().label("username"),
      password: Joi.string().required().label("password"),
    }).unknown(true);
    try {
      const value = await schema.validateAsync(body);
      UserSchema.findOne({ username: req.body.username }, (err, loguser) => {
        if (!loguser) {
          res.status(400).json({ error: true, message: "username not found" });
        } else {
          loguser.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch) {
              res.status(200).json({
                error: false,
                data: loguser,
                message: "Login Successful",
              });
            } else {
              res
                .status(400)
                .json({ error: true, message: "Invalid Password" });
            }
          });
        }
      });
    } catch (error) {
      res.status(400).json({ error: true, message: error.message });
    }
  },

  signInWithLinkedIn: async (req, res) => {
    const token = req.query.code;
    const redirect_URI = req.query.redirect_URI;
    try {
      const response = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        null,
        {
          params: {
            grant_type: "authorization_code",
            code: token,
            redirect_uri: redirect_URI,
            client_id: "78bzws0w7qzcqx",
            client_secret: "aayl1eoxcYa7a0hw",
            // scope:"r_fullprofile,r_emailaddress,w_member_social"
          },
        }
      );
      if (response.data.access_token) {
        let webApiUrl =
          "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))";
        let webApiUrlEmail =
          "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";
        let tokenStr = response.data.access_token;
        try {
          const data = await axios.get(webApiUrl, {
            headers: { Authorization: `Bearer ${tokenStr}` },
          });
          const dataEmail = await axios.get(webApiUrlEmail, {
            headers: { Authorization: `Bearer ${tokenStr}` },
          });
          // console.log(response);
          // console.log(data);
          res.status(200).json({
            error: true,
            data: {
              firstname: data.data.firstName["localized"].en_US,
              lastname: data.data.lastName["localized"].en_US,
              email: dataEmail.data.elements[0]["handle~"].emailAddress,
              profilePicture:
                data.data.profilePicture["displayImage~"].elements[0]
                  .identifiers[0].identifier,
            },
          });
        } catch (error) {
          res.status(400).json({
            error: true,
            message: error.message,
          });
        }
      } else {
        res.status(400).json({
          error: true,
          messages: "token expired or not found",
        });
      }
    } catch (error) {
      res.status(400).json({
        error: true,
        data: error.message,
      });
    }
  },

  loginWithLinkedIn: async (req, res) => {
    console.log("hua hai bhai");
    const token = req.query.code;
    const redirect_URI = req.query.redirect_URI;
    try {
      const response = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        null,
        {
          params: {
            grant_type: "authorization_code",
            code: token,
            redirect_uri: redirect_URI,
            client_id: "78bzws0w7qzcqx",
            client_secret: "aayl1eoxcYa7a0hw",
            // scope:"r_fullprofile,r_emailaddress,w_member_social"
          },
        }
      );
      console.log(response.data);
      if (response.data.access_token) {
        let webApiUrlEmail =
          "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";
        let tokenStr = response.data.access_token;
        try {
          const dataEmail = await axios.get(webApiUrlEmail, {
            headers: { Authorization: `Bearer ${tokenStr}` },
          });
          try {
            const useremail =
              dataEmail.data.elements[0]["handle~"].emailAddress;
            console.log("useremail", useremail);
            UserSchema.findOne({ email: useremail }, (err, loguser) => {
              if (err || loguser == null) {
                res
                  .status(404)
                  .json({ error: true, message: "email not found" });
              } else {
                console.log("userkadeatil hai", loguser);
                res.status(200).json({
                  error: false,
                  data: loguser,
                  message: "Login Successful",
                });
              }
            });
          } catch (error) {
            res.status(400).json({ error: true, message: error.message });
          }
        } catch (error) {
          res.status(400).json({
            error: true,
            message: error.message,
          });
        }
      } else {
        res.status(400).json({
          error: true,
          messages: "token expired or not found",
        });
      }
    } catch (error) {
      res.status(400).json({
        error: true,
        data: error.message,
      });
    }
  },
};

module.exports = AuthControllers;
