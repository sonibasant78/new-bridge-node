const { baseUrl } = require("./../../global-variable");

const AdminMiddleware = {
  isNotLogin: (req, res, next) => {
    if (req.session.admin) {
      return res.redirect(baseUrl + "/admin/layout");
    } else {
      // console.log('Hey else John.');
      next();
    }
  },
  isLogin: (req, res, next) => {
    if (req.session.admin) {
      // console.log('welcome johnnny.!');
      next();
    } else {
      return res.redirect(baseUrl + "/admin/login");
    }
  },
};
module.exports = AdminMiddleware;
