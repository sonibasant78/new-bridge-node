const mongoose = require("mongoose")
const gv = require("./../../global-variable")

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(gv.dbConfig["MONGODB_URI"], connectionParams)
  .then((data) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

require("../models/user");
require("../models/school");
require("../models/interest");
require("../models/about");
require("../models/grade");
require("../models/bridgedUser");
require("../models/chatChannel");
require("../models/message");
require("../models/education");
require("../models/experience");
require("../models/notification");
require("../models/admin");
