const mongoose = require("mongoose");
const SchoolSchema = mongoose.model("School");
const InterestSchema = mongoose.model("Interest");
const UserSchema = mongoose.model("User");
const AboutSchema = mongoose.model("About");
const GradeSchema = mongoose.model("Grade");
const BridgedUserSchema = mongoose.model("BridgedUser");
const ChatChannelSchema = mongoose.model("ChatChannel");
const MessageSchema = mongoose.model("Message");
const ExperienceSchema = mongoose.model("Experience");
const EducationSchema = mongoose.model("Education");
const NotificationSchema = mongoose.model("Notification");
const request = require("request");
var jwt = require("jsonwebtoken");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const gv = require("../../../global-variable");
const Joi = require("joi");
const fileUplaad = require("../../utilities/fileUpload");
const { ObjectId } = require("bson");

const UserControllers = {
    schoolList: async (req, res) => {
        try {
            console.log("my value hai",req.query);
            if (!req.query.schoolname) {
                const results = await SchoolSchema.find().exec();
                res
                    .status(200)
                    .json({ error: false, data: results, message: "success" });
            } else {
                const schools = req.query.schoolname;
                const matchresult = await SchoolSchema.find({
                    schoolname: { $regex: schools, $options: "$i" },
                }).exec();
                res
                    .status(200)
                    .json({ error: false, data: matchresult, message: "success" });
            }
        } catch (error) {
            console.log("error message :",error.message);
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    interestList: async (req, res) => {
        try {
            if (!req.query.interest) {
                const result = await InterestSchema.find().exec();
                res
                    .status(200)
                    .json({ error: false, data: result, message: "success" });
            } else {
                const interests = req.query.interest;
                const matchresult = await InterestSchema.find({
                    interest: { $regex: interests, $options: "$i" },
                }).exec();
                res
                    .status(200)
                    .json({ error: false, data: matchresult, message: "success" });
            }
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    forgotPassword: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            email: Joi.string()
                .required()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .label("email"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            const loguser = await UserSchema.findOne({ email: body.email }).exec();

            // return res.json(loguser)

            if (!loguser) {
                res.status(400).json({ error: true, message: "Invalid Email" });
            } else {
                // using mailtrap here
                async function main() {
                    var transporter = nodemailer.createTransport({
                        host: gv.dbConfig.SMTP_HOST,
                        port: gv.dbConfig.SMTP_PORT,
                        // for local
                        secure: false,
                        // for production
                        // secure: true,
                        auth: {
                            user: gv.dbConfig.SMTP_USER,
                            pass: gv.dbConfig.SMTP_PASS,
                        },
                        tls: { rejectUnauthorized: false },
                    });

                    const token = jwt.sign({ _id: loguser._id },
                        gv.dbConfig.RESET_KEY, { expiresIn: "20m" },
                        "RESTFULAPIs"
                    );
                    // send mail with defined transport object
                    await transporter.sendMail({
                        from: "joseph@bridgeme.us", // sender address
                        to: value.email, // list of receivers
                        subject: "Hello ✔", // Subject line
                        text: "Hello world?", // plain text body
                        html: `<b>Please reset your password by Clicking</b><a href='http://165.22.222.20/demo/bridge-new/reset-password/${token}'>Here</a>`, // html body
                    });
                    console.log("below mail send");
                    console.log("token:", token);
                    UserSchema.updateMany({ code: token }, (err, success) => {
                        if (err) {
                            console.log("code:", code);
                            return res
                                .status(400)
                                .json({ error: "user with this email does not exist" });
                        } else {
                            return res
                                .status(200)
                                .json({ error: false, message: "Email has been sent" });
                        }
                    }).where({ email: body.email });
                }
                main().catch(console.error);
            }
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    resetPassword: async (req, res) => {

        try {
            const { code, newPassword, confirmPassword } = req.body;
            console.log("mera new password:", newPassword);
            console.log("mera confirm password:", confirmPassword);
            if (!confirmPassword) {
                res
                    .status(400)
                    .json({ error: true, message: "please confirm your password" });
            }

            if (code) {
                jwt.verify(
                    code,
                    gv.dbConfig.RESET_KEY, { token_type: "Bearer" },
                    (error, decodedData) => {
                        if (error) {
                            return res
                                .status(401)
                                .json({ error: "incorrect code or it is expired" });
                        }
                        if (newPassword != confirmPassword) {
                            return res
                                .status(401)
                                .json({ error: true, message: "password not matched" });
                        } else {
                            UserSchema.findOne({ code }, (err, user) => {
                                if (err || !user) {
                                    return res
                                        .status(401)
                                        .json({ error: "user with this token dosen't exist" });
                                }
                                const obj = {
                                    password: newPassword,
                                };
                                user = _.extend(user, obj);
                                user.save((err, doc) => {
                                    if (!err) {
                                        res.status(200).json({
                                            error: false,
                                            message: "reset password success",
                                        });
                                    } else {
                                        res
                                            .status(401)
                                            .json({ error: true, message: "reset password failed" });
                                    }
                                });
                            });
                        }
                    }
                );
            } else {
                res.status(401).json({ error: true, message: "code not found" });
            }
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    userList: async (req, res) => {
        console.log("gaya hau");
        try {
            if (!req.query.firstname) {
                UserSchema.find({}, (err, results) => {
                    if (!err) {
                        res
                            .status(200)
                            .json({ error: false, data: results, message: "success" });
                    } else {
                        res.status(400).json({ error: true, message: "failed" });
                    }
                }).populate("schoolid", "schoolname").populate("experience").populate("education");
            } else {
                const users = req.query.firstname;
                const userData = await UserSchema
                    .find({ firstname: { $regex: users, $options: "$i" } })
                    .populate("schoolid", "schoolname")
                    .populate("experience")
                    .populate("education")

                if (!userData) {
                    res.status(400).json({ error: true, message: "failed" });
                } else {
                    console.log('Sab badiya');
                    res.status(200).json({ error: false, data: userData, message: "success" });
                }
            }
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    changeUsername: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            newUsername: Joi.string().min(2).required().label(" New username"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            const id = value.userid;
            const result = await UserSchema.updateOne({ _id: id }, {
                $set: {
                    username: body.newUsername,
                },
            });
            UserSchema.findOne({ _id: id }, (err, user) => {
                if (err) {
                    res.status(400).json({ err: true, message: "user not found" });
                } else {
                    res
                        .status(200)
                        .json({ err: false, data: user, message: "username changed" });
                }
            });
        } catch (err) {
            res.status(400).json({ error: true, message: err.message });
        }
    },

    addUserInterest: async (req, res, next) => {
        console.log("addUserInterest api called");

        const body = req.body;
        const schema = Joi.object({
            interests: Joi.array().required().label("Please enter your interest"),
            userid: Joi.string().required().label("Please enter your userid"),
            // name: Joi.array().required().label("Please enter your name"),
            // username: Joi.array().required().label("Please enter your username"),
            // email: Joi.array().required().label("Please enter your email")
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            let interests = value.interests;
            let uniqueChars = [...new Set(interests)]; // to remove duplicate interest
            const id = value.userid;
            console.log("id ", id);
            // return;

            const result = await UserSchema.updateOne({ _id: id }, {
                $addToSet: {
                    interests: uniqueChars,
                },
            });
            res.status(200).json({ err: false, message: "interest updated" });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    changeUserPassword: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            userid: Joi.string().required().label("user not found"),
            oldPassword: Joi.string().min(4).required().label("oldPassword"),
            newPassword: Joi.string().min(4).required().label("newPassword"),
            confirmPassword: Joi.string().min(4).required().label("confirmPassword"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            const id = value.userid;
            UserSchema.findOne({ _id: id }, (err, user) => {
                try {
                    user.comparePassword(value.oldPassword, (err, isMatch) => {
                        if (isMatch) {
                            if (value.confirmPassword) {
                                if (value.newPassword === value.confirmPassword) {
                                    const obj = {
                                        password: value.newPassword,
                                    };
                                    user = _.extend(user, obj);
                                    user.save((err, doc) => {
                                        if (!err) {
                                            res.status(200).json({
                                                error: false,
                                                message: "reset password success",
                                            });
                                        } else {
                                            res.status(401).json({
                                                error: true,
                                                message: "reset password failed",
                                            });
                                        }
                                    });
                                } else {
                                    return res.status(401).json({
                                        error: "new password and confirm password not matched",
                                    });
                                }
                            } else {
                                res.status(401).json({ error: "Please confirm your password" });
                            }
                        } else {
                            res
                                .status(400)
                                .json({ error: true, message: "old password not matched" });
                        }
                    });
                } catch (error) {
                    res.status(400).json({ error: true, message: "please login first" });
                }
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    deleteUserAccount: async (req, res) => {
        try {
            const id = req.body.userid;
            UserSchema.findOne({ _id: id }, (err, user) => {
                if (err || !user) {
                    res.status(400).json({ err: true, message: "Account not found" });
                } else {
                    UserSchema.deleteOne({ _id: id }, (err, user) => {
                        if (err || !user) {
                            res
                                .status(400)
                                .json({ err: true, message: "Account not deleted" });
                        } else {
                            res.status(200).json({ err: false, message: "Account deleted" });
                        }
                    });
                }
            });
        } catch (error) {
            res.status(400).json({ error: true, message: "please login first" });
        }
    },

    aboutList: async (req, res) => {
        if (!req.query.about) {
            AboutSchema.find({}, (err, results) => {
                if (!err) {
                    res
                        .status(200)
                        .json({ error: false, data: results, message: "success" });
                } else {
                    res.status(200).json({ error: true, message: "failed" });
                }
            });
        } else {
            const abouts = req.query.about;
            AboutSchema.find({ about: { $regex: abouts, $options: "$i" } })
                .then((response) => {
                    res
                        .status(200)
                        .json({ error: false, data: response, message: "success" });
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ return: true, data: err, message: "about not found" });
                });
        }
    },

    gradeList: async (req, res) => {
        if (!req.query.grade) {
            GradeSchema.find({}, (err, results) => {
                const nums = results.filter(n => typeof n == "number").sort(); // If the data type of a given element is a number store it in this array (and then sort)
                const non_nums = results.filter(x => typeof x != "number").sort();
                const newResult = [...non_nums, ...nums];
                if (!err) {
                    res
                        .status(200)
                        .json({ error: false, data: newResult, message: "success" });
                } else {
                    res.status(200).json({ error: true, message: "failed" });
                }
            })
        } else {
            const grades = req.query.grade;
            GradeSchema.find({ about: { $regex: grades, $options: "$i" } })
                .then((response) => {
                    res
                        .status(200)
                        .json({ error: false, data: response, message: "success" });
                })
                .catch((err) => {
                    res
                        .status(400)
                        .json({ return: true, data: err, message: "grade not found" });
                });
        }
    },

    UserHelp: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            about: Joi.string().required().label("about"),
            schoolname: Joi.string().required().label("schoolname"),
            email: Joi.string()
                .required()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .label("email"),
            help: Joi.string().required().label("help"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);

            SchoolSchema.findOne({ _id: value.schoolid }, (err, school) => {
                if (school.schoolname === value.schoolname) {
                    UserSchema.findOne({ _id: value.userid }, (err, user) => {
                        if (user.email === value.email) {
                            async function main() {
                                var transporter = nodemailer.createTransport({
                                    host: gv.dbConfig.SMTP_HOST,
                                    port: gv.dbConfig.SMTP_PORT,
                                    // for local
                                    secure: false,
                                    // for production
                                    // secure: true,
                                    auth: {
                                        user: gv.dbConfig.SMTP_USER,
                                        pass: gv.dbConfig.SMTP_PASS,
                                    },

                                    tls: { rejectUnauthorized: false },
                                });

                                // const token = jwt.sign(
                                //   { _id: loguser._id },
                                //   gv.dbConfig.RESET_KEY,
                                //   { expiresIn: "20m" },
                                //   "RESTFULAPIs"
                                // );
                                // send mail with defined transport object
                                let info = await transporter.sendMail({
                                    from: value.email, // sender address
                                    to: "basantsoni7697@gmail.com", // list of receivers
                                    subject: "Hello ✔", // Subject line
                                    text: "Hello world?", // plain text body
                                    html: `<b> Hello basantsoni7697@gmail.com</b> <br> user Data: <br> About -- ${value.about} <br> Schoolname -- ${value.schoolname} <br> Help -- ${value.help}`, // html body
                                });
                            }
                            main().catch(console.error);
                            res
                                .status(200)
                                .json({ error: false, message: "Email has been sent" });
                        }
                    });
                } else {
                    res.status(400).json({
                        error: true,
                        message: "please enter your school name only",
                    });
                }
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    userRecentlyJoined: async (req, res) => {
        const schoolId = req.query.schoolId;
        const userId = req.query.userId;
        try {
            UserSchema.find({ schoolid: schoolId, _id: { $not: { $eq: userId } } }, //find all users except the already loggedin user
                (err, users) => {
                    if (!err) {
                        res.status(200).json({
                            error: false,
                            data: users,
                            message: "user data found",
                        });
                    } else {
                        res.status(400).json({
                            error: false,
                            message: "user data not found ",
                        });
                    }
                }
            )
                .populate("schoolid", "schoolname")
                .sort({ createdAt: -1 });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    userRecommended: async (req, res) => {
        try {
            const id = req.query.userId;
            const results = await UserSchema.find({ _id: id });
            const user = await UserSchema.find({
                interests: { $in: results[0].interests },
                _id: { $not: { $eq: id } },
            })
                .populate("schoolid", "schoolname")
                .sort({ createdAt: -1 });

            res.status(200).json({
                error: false,
                data: user,
                message: "success to search",
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    editProfile: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            firstname: Joi.string().required().label("first name"),
            lastname: Joi.string().required().label("last name"),
            email: Joi.string()
                .required()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .label("email"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            const file = req.files.image;
            const id = req.body.userid;
            const desc = req.body.description;

            if (file) {
                var filePath = await fileUplaad.localFileUpload(file, "images"); //to upload the image of the user
            }

            await UserSchema.updateMany({ _id: id }, {
                $set: {
                    image: filePath,
                    firstname: value.firstname,
                    lastname: value.lastname,
                    email: value.email,
                    description: desc,
                },
            });
            res.status(200).json({
                error: false,
                message: "Update Profile Success",
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    userProfleData: async (req, res) => {
        try {
            const id = req.query.userid;
            const user = await UserSchema.findOne({ _id: id }).populate(
                "schoolid",
                "schoolname"
            );
            res.status(200).json({
                err: false,
                data: user,
                message: "user found",
            });
        } catch (error) {
            res.status(400).json({
                err: true,
                message: error.message,
            });
        }
    },

    userInterest: async (req, res) => {
        try {
            const id = req.query.userid;
            const interest = await UserSchema.findOne({ _id: id });
            res.status(200).json({
                err: false,
                data: interest.interests,
                message: "interest found",
            });
        } catch (error) {
            res.status(400).json({
                err: true,
                message: error.message,
            });
        }
    },

    //ispe research karna baaki hai
    addGrade: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            grades: Joi.array().required().label("Please enter your grade"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            let grades = value.grades;
            let uniqueChars = [...new Set(grades)]; // to remove duplicate grades
            const id = value.userid;
            UserSchema.findOne();
            const result = await UserSchema.updateOne({ _id: id }, {
                $addToSet: {
                    grades: uniqueChars,
                },
            });
            res.status(200).json({ err: false, message: "grade updated" });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    peopleYouMayKnow: async (req, res) => {
        try {
            const id = req.query.userId;
            const results = await UserSchema.find({ _id: id });
            const type = results[0].accountType;
            if (type == "student") {
                const user = await UserSchema.find({
                    grades: { $in: results[0].grades },
                    _id: { $not: { $eq: id } },
                }).populate("schoolid", "schoolname");
                res.status(200).json({
                    error: false,
                    data: user,
                    message: "success to search",
                });
            } else {
                const user = await UserSchema.find({
                    childrengrade: { $in: results[0].childrengrade },
                    _id: { $not: { $eq: id } },
                }).populate("schoolid", "schoolname");
                res.status(200).json({
                    error: false,
                    data: user,
                    message: "success to search",
                });
            }
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    addBridges: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            userid: Joi.string().required().label("userid"),
            bridgeduserid: Joi.string().required().label("bridgeduserid"),
        }).unknown(true);

        const bridged = new BridgedUserSchema();
        try {
            const value = await schema.validateAsync(body);
            bridged.userid = value.userid;
            bridged.bridgeduserid = value.bridgeduserid;

            const result = await BridgedUserSchema.find({
                $or: [{
                    $and: [
                        { userid: bridged.userid },
                        { bridgeduserid: bridged.bridgeduserid },
                    ],
                },
                {
                    $and: [
                        { userid: bridged.bridgeduserid },
                        { bridgeduserid: bridged.userid },
                    ],
                },
                ],
            });
            if (result.length == 0) {
                await bridged.save();
                res.json({
                    error: false,
                    data: bridged,
                    message: "Bridged Successful",
                });
            } else {
                res.status(200).json({
                    bridged: true,
                    message: "Already bridged",
                });
            }
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    removeBridge: async (req, res) => {
        const userId = req.body.userid;
        const BridgedUserId = req.body.bridgeduserid;
        try {
            await BridgedUserSchema.deleteOne({
                $or: [
                    { $and: [{ userid: userId }, { bridgeduserid: BridgedUserId }] },
                    { $and: [{ userid: BridgedUserId }, { bridgeduserid: userId }] },
                ],
            });
            res.status(200).json({
                error: false,
                message: "bridge removed",
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    bridgedUserShow: async (req, res) => {
        const userId = req.query.userid;
        try {
            const user = await BridgedUserSchema.find()
                .where({ $or: [{ userid: userId }, { bridgeduserid: userId }] })
                .sort({ createdAt: -1 });
            const arr = [];
            console.log(user);
            user.map((x) =>
                x.userid.toString() === userId ?
                    arr.push(x.bridgeduserid) :
                    arr.push(x.userid)
            );

            const result = await UserSchema.find({ _id: { $in: arr } });

            let finalUserListArray = [];
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (arr[i] != result[j]._id.toString()) continue;
                    finalUserListArray.push(result[j]);
                }
            }

            res.status(200).json({
                error: false,
                data: finalUserListArray,
                message: "bridged user found",
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    isBridged: async (req, res) => {
        const userId = req.query.userid;
        const isBridgedUserId = req.query.isBridgedUserId;
        try {
            const result = await BridgedUserSchema.find({
                $or: [
                    { $and: [{ userid: userId }, { bridgeduserid: isBridgedUserId }] },
                    { $and: [{ userid: isBridgedUserId }, { bridgeduserid: userId }] },
                ],
            });
            if (result.length == 0) {
                res.status(200).json({
                    bridged: false,
                    message: "Bridge",
                });
            } else {
                res.status(200).json({
                    bridged: true,
                    message: "Bridged",
                });
            }
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    sendMessage: async (req, res) => {
        console.log("sendMessage api called",);
        const body = req.body;
        const schema = Joi.object({
            senderId: Joi.string().required().label("sender"),
            recieverId: Joi.string().required().label("reciever"),
            message: Joi.string().required().label("message"),
        }).unknown(true);
        const channel = new ChatChannelSchema();
        const msg = new MessageSchema();
        const seen = new NotificationSchema();
        try {
            const value = await schema.validateAsync(body);
            channel.sender_id = value.senderId;
            channel.reciever_id = value.recieverId;
            try {
                const result = await ChatChannelSchema.find({
                    $or: [{
                        $and: [
                            { sender_id: channel.sender_id },
                            { reciever_id: channel.reciever_id },
                        ],
                    },
                    {
                        $and: [
                            { sender_id: channel.reciever_id },
                            { reciever_id: channel.sender_id },
                        ],
                    },
                    ],
                }).exec();
                console.log("ye mera result hai", result);
                if (result.length == 0) {
                    const doc = await channel.save();
                    console.log("doc", doc);
                    msg.chatChannel_id = channel._id.toString();
                } else {
                    msg.chatChannel_id = result[0]._id;
                }

                msg.sender_id = value.senderId;
                msg.reciever_id = value.recieverId;
                msg.message = value.message;

                await msg.save();
                seen.userId = value.recieverId;
                seen.senderId = value.senderId;
                seen.messageId = msg._id;

                await seen.save();
                res.status(200).json({
                    error: false,
                    message: "message sent",
                    data: { messageId: msg._id }
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
    },

    editMessage: async (req, res) => {
        console.log("edit message api called");
        const body = req.body;
        console.log("body ", body);
        const schema = Joi.object({
            messageId: Joi.string().required().label("messageId"),
            message: Joi.string().required().label("message"),
        }).unknown(true);

        try {
            const value = await schema.validateAsync(body);
            MessageSchema.updateMany({ _id: body.messageId }, { message: body.message }, async function (error, result) {
                console.log('hell yeah');
                if (error) {
                    res.status(400).json({ error: true, message: error.message });
                } else {
                    console.log(result);
                    res.status(200).json({ error: false, message: "Message edited successfully.!" });
                }
            })
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    //aggregate framework used***
    chatList: async (req, res) => {
        const userId = req.query.user_id;
        try {
            const user = await ChatChannelSchema.aggregate([{
                $match: {
                    $or: [
                        { sender_id: ObjectId(userId) },
                        { reciever_id: ObjectId(userId) },
                    ],
                },
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "chatChannel_id",
                    as: "messages",
                },
            },
            {
                $addFields: {
                    messages: { $slice: ["$messages", -1] },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender_id",
                    foreignField: "_id",
                    as: "senderData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reciever_id",
                    foreignField: "_id",
                    as: "recieverData",
                },
            },
            ]);
            const arr = [];
            user.map(async (x) => {
                let obj = {};
                if (x.senderData[0]._id.toString() === userId) {
                    obj = {
                        recieverMessage: x.recieverData[0] ? x.recieverData[0].firstname : null,
                        recieverId: x.recieverData[0] ? x.recieverData[0]._id.toString() : null,
                        image: x.recieverData[0] ? x.recieverData[0].image : null,
                    }
                } else {
                    obj = {
                        recieverMessage: x.senderData[0] ? x.recieverData[0]._id.toString() : null,
                        recieverId: x.senderData[0] ? x.senderData[0]._id.toString() : null,
                        image: x.senderData[0] ? x.senderData[0].image : null,
                    }
                }
                obj['channel_id'] = x._id.toString();
                obj['message'] = x.messages[0].message;
                obj['time'] = x.messages[0].createdAt;

                arr.push(obj);
            });

            for (let i = 0; i < arr.length; i++) {
                const metadata = await NotificationSchema.find({
                    $and: [{ senderId: ObjectId(arr[i].recieverId) }, { isSeen: false }],
                });
                arr[i]["count"] = metadata.length;
            }
            const finarr = _.sortBy(arr, "time");
            res.status(200).json({
                error: false,
                data: finarr.reverse(),
                message: "chat list mil gayi",
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    //pagination left***
    showChats: async (req, res) => {
        console.log("showChats api called");
        const body = req.query;
        console.log(body);
        const schema = Joi.object({
            sender_id: Joi.string().required().label("sender_id"),
            reciever_id: Joi.string().required().label("reciever_id"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);

            const result = await MessageSchema.aggregate([{
                $match: {
                    $or: [{
                        $and: [
                            { sender_id: ObjectId(value.sender_id) },
                            { reciever_id: ObjectId(value.reciever_id) },
                        ],
                    },
                    {
                        $and: [
                            { sender_id: ObjectId(value.reciever_id) },
                            { reciever_id: ObjectId(value.sender_id) },
                        ],
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sender_id",
                    foreignField: "_id",
                    as: "senderData",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reciever_id",
                    foreignField: "_id",
                    as: "recieverData",
                },
            },
            ]);

            const hua = await NotificationSchema.updateMany({ isSeen: true }).where({ userId: ObjectId(value.sender_id) }, { senderId: ObjectId(value.reciever_id) });

            console.log(hua);
            const arr = [];
            // return res.json(result);
            result.map((x) => {
                let obj = {};

                if (x.sender_id.toString() === value.sender_id) {
                    obj = {
                        senderMessage: x.message,
                        senderImage: x.senderData[0] ? x.senderData[0].image : null,
                        senderName: x.senderData[0] ? x.senderData[0].firstname : null,
                    }
                } else {
                    obj = {
                        recieverMessage: x.message,
                        recieverImage: x.senderData[0] ? x.senderData[0].image : null,
                        recieverName: x.senderData[0] ? x.senderData[0].firstname : null,
                    }
                }
                obj['message_id'] = x._id;
                obj['reaction_emoji_unicodes'] = x.reaction_emoji_unicodes;
                obj['messagedAt'] = x.createdAt;
                arr.push(obj);
            });

            res.status(200).json({ error: false, data: arr, message: "chat recieved" });
        } catch (error) {
            console.log("catch error.message");
            console.log(error.message);
            res.status(400).json({ error: true, message: error.message });
        }
    },

    zoomMeeting: async (req, res) => {
        const payload = req.body;
        console.log(payload);
        const config = {
            token: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImNtWDRxZDlBU0gyOTVGbWZEekVjc0EiLCJleHAiOjE2NDk1MDk2NzgsImlhdCI6MTY0ODkwNDg3OH0.kYr0xvCt9i3n0kR1KR8-EqMJf42z8SNMWRfOd5_i2-o",
            email: "patel.deepak750@gmail.com",
        };
        try {
            var options = {
                url: `https://api.zoom.us/v2/users/${config.email}/meetings`,
                method: "POST",
                auth: {
                    bearer: config.token,
                },
                json: true,
                body: {
                    start_time: payload.date,
                    duration: payload.duration,
                    topic: payload.topic,
                    type: 2,
                },
            };
            request(options, (error, response, body) => {
                res.status(200).json({
                    error: false,
                    data: response,
                });
                // if (!error && response.statusCode === 201) {
                //     res.send({ message: "meeting has been successfully created" });
                //   } else {
                //       res.send({ message: body.message });
                //    }
            });
        } catch (error) {
            res.status(500).json({
                error: true,
                message: error.message,
            });
        }
    },

    saveExperience: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            userId: Joi.string().required().label("userid"),
            title: Joi.string().required().label("title"),
            employment: Joi.string().required().label("employement"),
            company: Joi.string().required().label("company"),
            location: Joi.string().allow("", null),
            startMonth: Joi.string().allow("", null),
            startYear: Joi.string().allow("", null),
            endMonth: Joi.string().allow("", null),
            endYear: Joi.string().allow("", null),
        }).unknown(true);

        const experience = new ExperienceSchema();
        try {
            const value = await schema.validateAsync(body);
            (experience.userId = value.userId),
                (experience.title = value.title),
                (experience.employment = value.employment),
                (experience.company = value.company),
                (experience.location = value.location),
                (experience.startMonth = value.startMonth),
                (experience.startYear = value.startYear),
                (experience.endMonth = value.endMonth),
                (experience.endYear = value.endYear),
                await experience.save();
            await UserSchema.updateMany({ _id: value.userId }, {
                $push: {
                    experience: experience._id.toString(),
                },
            });
            res.status(200).json({
                error: false,
                data: experience,
                message: "Experience Saved",
            });
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: true, message: error.message });
        }
    },

    editExperience: async (req, res) => {
        console.log("edit experience api called");
        const query = req.body;
        console.log("query ", query);
        const schema = Joi.object({
            experienceId: Joi.string().required().label("experienceid"),
            title: Joi.string().label("title"),
            employment: Joi.string().label("employement"),
            company: Joi.string().label("company"),
            location: Joi.string().allow("", null),
            startMonth: Joi.string().allow("", null),
            startYear: Joi.string().allow("", null),
            endMonth: Joi.string().allow("", null),
            endYear: Joi.string().allow("", null),
        }).unknown(true);

        try {
            const value = await schema.validateAsync(query);
            const update = {
                title: query.title,
                employment: query.employment,
                company: query.company,
                location: query.location,
                startMonth: query.startMonth,
                startYear: query.startYear,
                endMonth: query.endMonth,
                endYear: query.endYear

            }
            ExperienceSchema.updateMany({ _id: query.experienceId }, update, { new: true },
                function (error, result) {

                    if (error) {
                        res.status(400).json({
                            error: true,
                            message: error.message
                        });
                    } else {
                        console.log(result);
                        res.status(200).json({
                            error: false,
                            message: "experience edited",
                            experience: result
                        });
                    }
                })


        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }


    },

    saveEducation: async (req, res) => {
        const body = req.body;
        const schema = Joi.object({
            userId: Joi.string().required().label("userid"),
            business: Joi.string().required().label("bussiness"),
            startMonth: Joi.string().allow("", null),
            startYear: Joi.string().allow("", null),
            endMonth: Joi.string().allow("", null),
            endYear: Joi.string().allow("", null),
            grade: Joi.string().allow("", null),
            activities: Joi.string().required().label("activities"),
        }).unknown(true);

        const education = new EducationSchema();
        try {
            const value = await schema.validateAsync(body);
            education.userId = value.userId;
            education.business = value.business;
            education.startMonth = value.startMonth;
            education.startYear = value.startYear;
            education.endMonth = value.endMonth;
            education.endYear = value.endYear;
            education.grade = value.grade;
            education.activities = value.activities;
            await education.save();
            await UserSchema.updateMany({ _id: value.userId }, {
                $push: {
                    education: education._id.toString(),
                },
            });
            res.status(200).json({
                error: false,
                data: education,
                message: "Education Saved",
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    editEducation: async (req, res) => {
        const body = req.body;
        console.log(body);
        const schema = Joi.object({
            educationId: Joi.string().required().label("educationid"),
            business: Joi.string().label("bussiness"),
            startMonth: Joi.string().allow("", null),
            startYear: Joi.string().allow("", null),
            endMonth: Joi.string().allow("", null),
            endYear: Joi.string().allow("", null),
            grade: Joi.string().allow("", null),
            activities: Joi.string().label("activities"),
        }).unknown(true);

        try {
            const value = await schema.validateAsync(body);

            const update = {
                business: body.business,
                startMonth: body.startMonth,
                startYear: body.startYear,
                endMonth: body.endMonth,
                endYear: body.endYear,
                grade: body.grade,
                activities: body.activities
            }
            EducationSchema.updateMany({ _id: body.educationId }, update, { new: true },
                function (error, result) {

                    if (error) {
                        res.status(400).json({
                            error: true,
                            message: error.message
                        });
                    } else {
                        console.log(result);
                        res.status(200).json({
                            error: false,
                            message: "education edited",
                            education: result
                        });
                    }
                });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    showExperiences: async (req, res) => {
        const body = req.query;
        const schema = Joi.object({
            userId: Joi.string().required().label("userid"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(body);
            const result = await ExperienceSchema.find({
                userId: ObjectId(value.userId),
            })
                .sort({ createdAt: -1 })
                .exec();
            res.status(200).json({
                error: false,
                data: result,
                message: "list recieved",
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    deleteExperiences: async (req, res) => {
        console.log("deleteExperiences called");
        const query = req.query;
        const schema = Joi.object({
            experienceId: Joi.string().required().label("userid"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(query);
            console.log("value ", value)
            ExperienceSchema.findOne({ _id: value.experienceId }, (err, user) => {
                if (err || !user) {
                    res.status(400).json({ err: true, message: "Experience not found" });
                } else {
                    ExperienceSchema.deleteOne({ _id: value.experienceId }, (err, user) => {
                        if (err || !user) {
                            res
                                .status(400)
                                .json({ err: true, message: "Experience not deleted" });
                        } else {
                            // console.log("delete experience data ", user);
                            // UserSchema.temp.update({ _id: "777" }, { $pull: { "someArray.0.someNestedArray": { "name": "delete me" } } })
                            res.status(200).json({ err: false, message: "success" });
                        }
                    });
                }
            });
        } catch (error) {
            res.status(400).json({ error: true, message: "please login first" });
        }
    },

    showEducations: async (req, res) => {
        const body = req.query;
        const schema = Joi.object({
            userId: Joi.string().required().label("userid"),
        }).unknown(true);

        try {
            const value = await schema.validateAsync(body);
            const result = await EducationSchema.find({
                userId: ObjectId(value.userId),
            })
                .sort({ createdAt: -1 })
                .exec();
            res.status(200).json({
                error: false,
                data: result,
                message: "list recieved",
            });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    },

    deleteEducation: async (req, res) => {
        console.log("deleteEducation called");
        const query = req.query;
        const schema = Joi.object({
            educationId: Joi.string().required().label("userid"),
        }).unknown(true);
        try {
            const value = await schema.validateAsync(query);
            console.log("value ", value)
            EducationSchema.findOne({ _id: value.educationId }, (err, user) => {
                if (err || !user) {
                    res.status(400).json({ err: true, message: "Education not found" });
                } else {

                    // Parent delete 
                    EducationSchema.deleteOne({ _id: value.educationId }, (err, user) => {

                        if (err || !user) {
                            res
                                .status(400)
                                .json({ err: true, message: "Education not deleted" });
                        } else {

                            // UserSchema.update({ _id: user._id }, { $pull: { 'experience': { number: experienceId } } });
                            // console.log("delete experience data ", user);
                            // UserSchema.temp.update({ _id: "777" }, { $pull: { "someArray.0.someNestedArray": { "name": "delete me" } } })
                            res.status(200).json({ err: false, message: "success" });
                        }
                    });
                }
            });
        } catch (error) {
            res.status(400).json({ error: true, message: "please login first" });
        }
    },

    unreadMsgCount: async (req, res) => {
        const userId = req.body.userid;
        try {
            const result = await NotificationSchema.find({
                $and: [{
                    userId: ObjectId(userId),
                },
                {
                    isSeen: false,
                },
                ],
            }).exec();
            res.status(200).json({
                error: false,
                unreadMessages: result.length,
            });
        } catch (error) {
            res.status(400).json({
                error: false,
                message: error.message,
            });
        }
    },

    addReactionToMessage: async (req, res) => {
        console.log("addReactionToMessage api called");
        const body = req.body;
        console.log(body);

        // return;
        const schema = Joi.object({
            messageId: Joi.required().label("messaage id is required"),
            unicode: Joi.array().required().label("unicode is reqired"),
        }).unknown(true);

        try {
            const value = await schema.validateAsync(body);

            let uniqueUnicodes = [...new Set(value.unicode)]; // to remove duplicate interest
            console.log("uniqueUnicodes ", uniqueUnicodes);

            const result = await MessageSchema
                .findOneAndUpdate({ _id: value.messageId }, { $addToSet: { reaction_emoji_unicodes: { $each: uniqueUnicodes } } }, { new: true });

            res.status(200).json({ err: false, message: "success", data: { messageId: result._id, unicodeList: result.reaction_emoji_unicodes } });
        } catch (error) {
            res.status(400).json({ error: true, message: error.message });
        }
    }
};

module.exports = UserControllers;