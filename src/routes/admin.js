const express = require("express");
const router = express.Router();
const { AdminAuthControllers } = require("../controllers/admin/index");
const { AdminControllers } = require("../controllers/admin/index");
const {AdminMiddleware} = require("../middleware/index")

router.get("/login", AdminMiddleware.isNotLogin,AdminAuthControllers.loginwebview);
router.get("/logout", AdminAuthControllers.logout);
router.get("/register", AdminAuthControllers.registerwebview);
router.get("/forgot-password", AdminControllers.forgotPasswordwebview);
router.get("/userlist", AdminControllers.userListwebview);
router.get("/interestlist", AdminControllers.interestListwebview);
router.get("/schoollist", AdminControllers.schoolListwebview);
router.get("/education", AdminControllers.EducationListwebview);
router.get("/experience", AdminControllers.ExperienceListwebview);
router.get("/upload", AdminControllers.uploadwebview);
router.get("/bridgedconnection", AdminControllers.BridgedUserListwebview);
router.get("/layout", AdminMiddleware.isLogin,AdminControllers.layoutwebview);
router.post("/register", AdminAuthControllers.register);
router.get("/user-list", AdminControllers.UserList);
router.post("/login", AdminMiddleware.isNotLogin,AdminAuthControllers.login);
router.post("/uploadSchoolcsv", AdminControllers.uploadSchoollistFile);
router.post("/uploadUsercsv", AdminControllers.uploadUserlistFile);
router.post("/uploadInterestcsv", AdminControllers.uploadInterestlistFile);
router.post("/addInterest", AdminControllers.AddInterests);
router.post("/editInterest", AdminControllers.EditInterest);
router.get("/deleteInterest:id", AdminControllers.DeleteInterests);
router.get("/bridgedUsers", AdminControllers.BridgedUserList);
router.post("/InterestList", AdminControllers.InterestList);
router.post("/addSchool", AdminControllers.AddSchool);
router.post("/editSchool", AdminControllers.EditSchool);
router.post("/editEducation", AdminControllers.EditEducation);
router.post("/editExperience", AdminControllers.EditExperience);
router.get("/deleteSchool:id", AdminControllers.DeleteSchool);
router.get("/deleteEducation:id", AdminControllers.DeleteEducation);
router.get("/deleteExperience:id", AdminControllers.DeleteExperience);

module.exports = router;
