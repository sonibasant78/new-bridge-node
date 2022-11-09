require("./src/db/db");
const express = require("express");
const { auth, user, admin } = require("./src/routes/index");
var app = express();
require("./global-variable");
const fileUpload = require("express-fileupload");
var cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
var session = require("express-session");
app.use(cors());
var flash = require("connect-flash");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.options("*", function (req, res) {
  res.sendStatus(200);
});

// which form u need the actual body of request json,urlencoded,etc
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    parseNested: true,
  })
);

// static files
app.set("views", path.join(__dirname, "/src/views/"));
app.use("/public", express.static(__dirname + "/src/public"));
app.set("view engine", "ejs");

// middleware
app.use("/auth", auth);
app.use("/user", user);
app.use("/admin", admin);


app.use((req, res, next) => {
  console.log("App.js " + count);
  count += 1;
  res.locals.formValue = req.flash("formValue")[0];
  res.locals.admin = req.session.admin;
  req.flash("formValue", req.body);
  next();
});

// error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.send(valErrors);
  }
});

module.exports = app;
