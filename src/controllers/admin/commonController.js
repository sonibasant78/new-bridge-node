const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var XLSX = require("xlsx");
const secretKey = "bridge";
const SchoolSchema = mongoose.model("School");
const InterestSchema = mongoose.model("Interest");
const UserSchema = mongoose.model("User");
const BridgedUserSchema = mongoose.model("BridgedUser");
const ExperienceSchema = mongoose.model("Experience");
const EducationSchema = mongoose.model("Education");
const fileUplaad = require("../../utilities/fileUpload");
const path = require("path");

const AdminControllers = {
    forgotPasswordwebview: async(req, res) => {
        console.log("loginwebview api called");
        res.render("forgot-password");
    },

    layoutwebview: async(req, res) => {
        console.log("loginwebview api called");
        res.render("layout");
    },

    userListwebview: async(req, res) => {
        console.log("loginwebview api  ye wala called");
        try {
            const data = await UserSchema.find({}).populate("schoolid").exec();
            console.log("data ", data.length);
            res.render("userlist", { data });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    uploadwebview: async(req, res) => {
        res.render("upload");
    },

    interestListwebview: async(req, res) => {
        try {
            const data = await InterestSchema.find({}).exec();
            res.render("interestlist", { data, message: req.flash("message") });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    schoolListwebview: async(req, res) => {
        try {
            const data = await SchoolSchema.find({}).exec();
            res.render("schoollist", { data });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    EducationListwebview: async(req, res) => {
        try {
            const data = await EducationSchema.find({}).exec();
            res.render("education", { data });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    ExperienceListwebview: async(req, res) => {
        try {
            const data = await ExperienceSchema.find({}).exec();
            res.render("experience", { data });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    BridgedUserListwebview: async(req, res) => {
        try {
            const data = await BridgedUserSchema.find({})
                .populate("userid")
                .populate("bridgeduserid")
                .exec();
            res.render("bridgedconnection", { data });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    BridgedUserList: async(req, res) => {
        try {
            const data = await BridgedUserSchema.find({})
                .populate("userid")
                .populate("bridgeduserid")
                .exec();
            res.status(200).json({
                data: data,
            });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    UserList: async(req, res) => {
        try {
            const data = await UserSchema.find({}).populate("schoolname").exec();
            res.render("userlist", { data });
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    AddInterests: async(req, res) => {
        const body = req.body;
        console.log(body);
        let interest = new InterestSchema();
        try {
            interest.interest = body.interest;
            await interest.save();
            req.flash("message", "Interest added successfully.");
            res.redirect("back");
        } catch (error) {
            req.flash("message", `failed to add interest .because ${error.message}`);
            res.redirect("back");
        }
    },

    EditInterest: async(req, res) => {
        const body = req.body;
        try {
            await InterestSchema.updateOne({ _id: body.id }, {
                $set: {
                    interest: body.editInterest,
                },
            });
            req.flash("message", "Interest updated successfully.");
            res.redirect("back");
        } catch (error) {
            console.log("error ", error);
            req.flash("message", `Interest updated failed .because ${error.message}`);
            res.redirect("back");
        }
    },

    InterestList: async(req, res) => {
        try {
            const result = await InterestSchema.find({}).exec();
            console.log(result);
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    DeleteInterests: async(req, res, next) => {
        const body = req.params;
        console.log(body.id);
        try {
            await InterestSchema.deleteOne({ _id: body.id });
            req.flash("message", "Interest deleted successfully.");
            res.redirect("back");
        } catch (error) {
            req.flash("message", `Interest delete failed .because ${error.message}`);
            res.redirect("back");
        }
    },

    AddSchool: async(req, res) => {
        const body = req.body;
        console.log(body);
        let school = new SchoolSchema();
        try {
            school.schoolname = body.schoolname;
            await school.save();
            res.redirect("schoollist");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    EditSchool: async(req, res) => {
        const body = req.body;
        try {
            await SchoolSchema.updateOne({ _id: body.id }, {
                $set: {
                    schoolname: body.editSchoolname,
                },
            });
            res.redirect("schoollist");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    DeleteSchool: async(req, res, next) => {
        const body = req.params;
        console.log(body.id);
        try {
            await SchoolSchema.deleteOne({ _id: body.id });
            res.redirect("schoollist");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    EditEducation: async(req, res) => {
        console.log("hua hai");
        const body = req.body;
        console.log(body);
        console.log("ye hai meri", body.activities);
        try {
            await EducationSchema.updateOne({ _id: body.id }, {
                $set: {
                    business: body.business,
                    startMonth: body.startMonth,
                    startYear: body.startYear,
                    endMonth: body.endMonth,
                    endYear: body.endYear,
                    grade: body.grade,
                    activities: body.activities,
                },
            });
            res.redirect("education");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    DeleteEducation: async(req, res, next) => {
        const body = req.params;
        console.log(body.id);
        try {
            await EducationSchema.deleteOne({ _id: body.id });
            res.redirect("education");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    EditExperience: async(req, res) => {
        console.log("hua hai");
        const body = req.body;
        console.log(body);
        console.log("ye hai meri", body.activities);
        try {
            await ExperienceSchema.updateOne({ _id: body.id }, {
                $set: {
                    title: body.title,
                    employment: body.employment,
                    company: body.company,
                    location: body.location,
                    startMonth: body.startMonth,
                    startYear: body.startYear,
                    endMonth: body.endMonth,
                    endYear: body.endYear,
                },
            });
            res.redirect("experience");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    DeleteExperience: async(req, res) => {
        const body = req.params;
        console.log(body.id);
        try {
            await ExperienceSchema.deleteOne({ _id: body.id });
            res.redirect("experience");
        } catch (error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        }
    },

    uploadSchoollistFile: async(req, res) => {
        console.log("hua hai");
        const body = req.files;
        const csvfile = body.csvfile;
        const filepath = await fileUplaad.SchooldocFileUpload(csvfile, "doc");
        console.log(csvfile);
        var workbook = XLSX.readFile(path.join(__dirname, "../../" + filepath));
        var sheet_name_list = workbook.SheetNames;
        console.log(sheet_name_list); // getting as Sheet1
        const data = [];
        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            //getting the complete sheet
            // console.log(worksheet);
            var headers = {};
            for (z in worksheet) {
                if (z[0] === "!") continue;
                //parse out the column, row, and value
                var col = z.substring(0, 1);
                // console.log(col);

                var row = parseInt(z.substring(1));
                // console.log(row);

                var value = worksheet[z].v;
                // console.log(value);

                //store header names
                if (row == 1) {
                    headers[col] = value;
                    // storing the header names
                    continue;
                }

                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
        });
        console.log("ye hai mera", data);
        try {
            await SchoolSchema.insertMany(data);
            console.log("hua hai");
            res.redirect("layout");
        } catch (error) {
            res.send(error.message);
        }
    },

    uploadUserlistFile: async(req, res) => {
        console.log("hua hai");
        const body = req.files;
        const csvfile = body.csvfile;
        const filepath = await fileUplaad.UserdocFileUpload(csvfile, "doc");

        var workbook = XLSX.readFile(path.join(__dirname, "../../" + filepath));
        var sheet_name_list = workbook.SheetNames;
        console.log(sheet_name_list); // getting as Sheet1
        const data = [];
        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            //getting the complete sheet
            // console.log(worksheet);
            var headers = {};
            for (z in worksheet) {
                if (z[0] === "!") continue;
                //parse out the column, row, and value
                var col = z.substring(0, 1);
                // console.log(col);

                var row = parseInt(z.substring(1));
                // console.log(row);

                var value = worksheet[z].v;
                // console.log(value);

                //store header names
                if (row == 1) {
                    headers[col] = value;
                    // storing the header names
                    continue;
                }

                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
        });

        console.log(data);
        for (var i = 0; i < data.length; i++) {
            token = jwt.sign({ data }, secretKey);
            data[i]["token"] = token;
        }
        try {
            await UserSchema.insertMany(data);
            console.log("hua hai");
            res.redirect("layout");
        } catch (error) {
            res.send(error.message);
        }
    },

    uploadInterestlistFile: async(req, res) => {
        console.log("hua hai");
        const body = req.files;
        const csvfile = body.csvfile;
        const filepath = await fileUplaad.InterestdocFileUpload(csvfile, "doc");

        var workbook = XLSX.readFile(path.join(__dirname, "../../" + filepath));
        var sheet_name_list = workbook.SheetNames;
        console.log(sheet_name_list); // getting as Sheet1
        const data = [];
        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            //getting the complete sheet
            // console.log(worksheet);
            var headers = {};
            for (z in worksheet) {
                if (z[0] === "!") continue;
                //parse out the column, row, and value
                var col = z.substring(0, 1);
                // console.log(col);

                var row = parseInt(z.substring(1));
                // console.log(row);

                var value = worksheet[z].v;
                // console.log(value);

                //store header names
                if (row == 1) {
                    headers[col] = value;
                    // storing the header names
                    continue;
                }

                if (!data[row]) data[row] = {};
                data[row][headers[col]] = value;
            }
            //drop those first two rows which are empty
            data.shift();
            data.shift();
            console.log(data);
        });
        try {
            await InterestSchema.insertMany(data);
            console.log("hua hai");
            res.redirect("layout");
        } catch (error) {
            res.send(error.message);
        }
    },
};

module.exports = AdminControllers;