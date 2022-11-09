const config = require("./src/config/config.json");
const path = require("path");

let env = "local";
// let env = "development";
// let env = 'production';

// let baseUrl = 'http://localhost:3000';

if (env === "local") {
  baseUrl = "http://localhost:9000";
  // here we can change the base url for production
} else if (env === "development") {
  baseUrl = "http://raphael-dashboard.hackerkernel.com";
  // here we can change the base url for production
}

if (env === "production") {
  baseUrl = "";
  // here we can change the base url for production
}

module.exports = {
  sourcePath: path.join(__dirname, "src"),
  baseUrl,
  dbConfig: config[env],
  secret: "bridgedbs",
  batchSize: 10,
};
