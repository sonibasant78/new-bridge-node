const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const Joi = require("joi");
const AdminSchema = mongoose.model("Admin");
const secretKey = "bridge";

const AdminAuthControllers = {
  loginwebview: async (req, res) => {
    console.log("loginwebview api called");
    res.render("login");
  },

  registerwebview: async (req, res) => {
    console.log("loginwebview api called");
    res.render("register");
  },

  register: async (req, res) => {
    const body = req.body;
    const user = new AdminSchema();
    try {
      user.firstname = body.firstname;
      user.lastname = body.lastname;
      user.email = body.email;
      user.password = body.password;
      user.token = jwt.sign({ user }, secretKey);
      if(body.password === body.confirmpassword){
        await user.save();
        res.redirect('login')
      }else{
        res.send("password not matched")
      }
    } catch (error) {
      res.status(400).json({ error: true, message: error.message });
    }
  },

  login: async (req, res, next) => {
    console.log("hua hai");
    const body = req.body;
    const schema = Joi.object({
      email: Joi.string().required().label("email"),
      password: Joi.string().required().label("password"),
    }).unknown(true);
    try {
      const value = await schema.validateAsync(body);
      AdminSchema.findOne({ email: value.email }, (err, loguser) => {
        if (!loguser) {
          res.status(400).json({ error: true, message: "email not found" });
        } else {
          loguser.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch) {
              req.session.admin = loguser;
              res.redirect('layout')
            } else {
           res.send("Invalid Password")
            }
          });
        }
      });
    } catch (error) {
      res.status(400).json({ error: true, message: error.message });
    }
  }, 
  
  logout: (req, res) => {
    console.log('Logout ho gaya');
    req.session.destroy();
    res.redirect('login');
}
};

module.exports = AdminAuthControllers;
