const jwt = require("jsonwebtoken");
const ErrorHandler = require("./errorHandler");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    next(new ErrorHandler("Please login to access this resource.", 401));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    req.user = user;
  });
  next();
};
