const gv = require("../../global-variable");
module.exports = {
  localFileUpload: (file, type) => {
    console.log("gv.sourcePath ", gv.sourcePath);
    console.log(" file.name ", file.name);
    var fileName = (Date.now().toString() + "-" + file.name).replace(/ /g, "");
    let uploadPath = `/public/uploads/${type}/`;
    let path = gv.sourcePath + uploadPath;
    return new Promise(function (resolve, reject) {
      file.mv(`${path}/${fileName}`, function (err) {
        if (err) {
          reject(err);
        }
        resolve(uploadPath + fileName);
      });
    });
  },

  SchooldocFileUpload: (csvfile, type) => {
    console.log("gv.sourcePath ", gv.sourcePath);
    // console.log(csvfile);
    console.log(" file.name ", csvfile.name);
    var fileName = (Date.now().toString() + "-" + csvfile.name).replace(/ /g, "");
    let uploadPath = `/public/uploads/${type}/`;
    let path = gv.sourcePath + uploadPath;
    console.log("path ",path);
    return new Promise(function (resolve, reject) {
      csvfile.mv(`${path}/${fileName}`, function (err) {
        if (err) {
          reject(err);
        }
        resolve(uploadPath + fileName);
      });
    });
  },

  UserdocFileUpload: (csvfile, type) => {
    console.log("gv.sourcePath ", gv.sourcePath);
    // console.log(csvfile);
    console.log(" file.name ", csvfile.name);
    var fileName = (Date.now().toString() + "-" + csvfile.name).replace(/ /g, "");
    let uploadPath = `/public/uploads/${type}/`;
    let path = gv.sourcePath + uploadPath;
    console.log("path ",path);
    return new Promise(function (resolve, reject) {
      csvfile.mv(`${path}/${fileName}`, function (err) {
        if (err) {
          reject(err);
        }
        resolve(uploadPath + fileName);
      });
    });
  },

  InterestdocFileUpload: (csvfile, type) => {
    console.log("gv.sourcePath ", gv.sourcePath);
    // console.log(csvfile);
    console.log(" file.name ", csvfile.name);
    var fileName = (Date.now().toString() + "-" + csvfile.name).replace(/ /g, "");
    let uploadPath = `/public/uploads/${type}/`;
    let path = gv.sourcePath + uploadPath;
    console.log("path ",path);
    return new Promise(function (resolve, reject) {
      csvfile.mv(`${path}/${fileName}`, function (err) {
        if (err) {
          reject(err);
        }
        resolve(uploadPath + fileName);
      });
    });
  },


};
