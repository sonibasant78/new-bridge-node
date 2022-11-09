const express = require("express");
const router = express.Router();
const { UserControllers } = require("../controllers/api/index");
const { CommonMiddleware } = require("../middleware/index")


router.get("/school-list", UserControllers.schoolList);
router.get("/interest-list", CommonMiddleware.isToken, UserControllers.interestList);
router.post("/forgot-password", UserControllers.forgotPassword);
router.post("/reset-password", UserControllers.resetPassword);
router.get("/user-list", UserControllers.userList);
router.post("/change-username", CommonMiddleware.isToken, UserControllers.changeUsername);
router.post("/add-userinterest", CommonMiddleware.isToken, UserControllers.addUserInterest);
router.post("/add-grade", CommonMiddleware.isToken, UserControllers.addGrade);
router.post("/change-userpassword", CommonMiddleware.isToken, UserControllers.changeUserPassword);
router.post("/delete-useraccount", CommonMiddleware.isToken, UserControllers.deleteUserAccount);
router.get("/about-list", CommonMiddleware.isToken, UserControllers.aboutList);
router.get("/grade-list", UserControllers.gradeList);
router.post("/user-help", CommonMiddleware.isToken, UserControllers.UserHelp);
router.get("/user-recently", CommonMiddleware.isToken, UserControllers.userRecentlyJoined);
router.get("/user-recommended", CommonMiddleware.isToken, UserControllers.userRecommended);
router.post("/edit-profile", CommonMiddleware.isToken, UserControllers.editProfile);
router.get("/profile-data", CommonMiddleware.isToken, UserControllers.userProfleData);
router.get("/userInterest-data", CommonMiddleware.isToken, UserControllers.userInterest);
router.get("/peopleyoumayknow", CommonMiddleware.isToken, UserControllers.peopleYouMayKnow);
router.post("/add-bridge", CommonMiddleware.isToken, UserControllers.addBridges);
router.post("/remove-bridge", CommonMiddleware.isToken, UserControllers.removeBridge);
router.get("/bridgeduser-show", CommonMiddleware.isToken, UserControllers.bridgedUserShow);
router.get("/is-bridged", CommonMiddleware.isToken, UserControllers.isBridged);
router.post("/send-message", CommonMiddleware.isToken, UserControllers.sendMessage);
router.post("/edit-message", CommonMiddleware.isToken, UserControllers.editMessage);
router.get("/last-message", CommonMiddleware.isToken, UserControllers.chatList);
router.get("/show-chat", CommonMiddleware.isToken, UserControllers.showChats);
router.post("/save-experience", CommonMiddleware.isToken, UserControllers.saveExperience);
router.post("/save-education", CommonMiddleware.isToken, UserControllers.saveEducation);
router.post("/edit-experience", CommonMiddleware.isToken, UserControllers.editExperience);
router.post("/edit-education", CommonMiddleware.isToken, UserControllers.editEducation);
router.get("/show-education", CommonMiddleware.isToken, UserControllers.showEducations);
router.get("/show-experience", CommonMiddleware.isToken, UserControllers.showExperiences);
router.get("/delete-experience", CommonMiddleware.isToken, UserControllers.deleteExperiences);
router.get("/delete-education", CommonMiddleware.isToken, UserControllers.deleteEducation);
router.post("/zoom-meeting", UserControllers.zoomMeeting);
router.get("/unreadMsg-count", UserControllers.unreadMsgCount);
router.post("/add-reaction", UserControllers.addReactionToMessage);

module.exports = router;