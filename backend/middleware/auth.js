const user = require("../models/userSchema");
const errorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("./asyncErrorHandler");
const jwt = require("jsonwebtoken");
// for authenticated users
exports.isAuthUser = asyncErrorHandler(async (req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return next(new errorHandler("Login/Register first"), 401);
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await user.findById(decodedData.id);
  // console.log(req.user.id);
  //   console.log(req.user);
  next();
});

exports.authRoles = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(new errorHandler(`Not Possible to access this Route`, 403));
    }
    next();
  };
};
