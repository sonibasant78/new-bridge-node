const express = require("express");
const router = express.Router();
const { AuthControllers } = require("../controllers/api/index");

router.post("/register",AuthControllers.register);
router.post("/login", AuthControllers.login);
router.post("/signIn-with-linkedIn",AuthControllers.signInWithLinkedIn)
router.post("/loginWith-linkedIn",AuthControllers.loginWithLinkedIn)

module.exports = router;
