const User = require("./../models/userModel");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendEmail = require("./../utils/sendEmail");
const { frontendUrl } = require("../helper");
exports.signUp = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (email === "" || username === "" || password === "") {
      next(new ErrorHandler("Please fill all the fields!"));
      return;
    }
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: hashedPassword1, ...userData } = newUser._doc;
    res
      .cookie("token", token, { httpOnly: true, expiresIn: "1d" })
      .status(200)
      .json({
        success: true,
        message: "Registered Successfully",
        newUser: userData,
        token,
      });
  } catch (err) {
    next(new ErrorHandler(`Somthing went wrong`, 404));
  }
};
// Login handler--
exports.login = async (req, res, next) => {
  try {
    // get user data--
    const { email, password } = req.body;
    // find user by email--
    const user = await User.findOne({ email });
    // check user exists or not--
    if (!user) {
      next(new ErrorHandler(`User not found!`, 400));
      return;
    }
    // check password--
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      next(new ErrorHandler(`Wrong credentials!`, 400));
      return;
    }
    // set token--
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // filter password from the doc--
    const { password: hashedPassword, ...userData } = user._doc;
    // send response to the client--
    res
      .status(201)
      .cookie("token", token, { httpOnly: true, expiresIn: "1d" })
      .json({
        message: "Logged In successfully",
        success: true,
        userData,
        token,
      });
  } catch (err) {
    next(new ErrorHandler(`Something went wrong!`, 404));
  }
};
// Google auth--
exports.googleAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password: hashedPassword, ...userData } = user._doc;
      res
        .cookie("token", token, { httpOnly: true, expiresIn: "1d" })
        .status(200)
        .json({
          message: "Logged In successfully",
          success: true,
          userData,
          token,
        });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(generatedPassword, salt);

      const generatedUsername =
        req.body.username.split(" ").join("").toLowerCase() +
        Math.floor(Math.random() * 10000).toString();

      const newUser = await User.create({
        username: generatedUsername,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.profilePicture,
      });

      const { password: hashedPassword2, ...userData } = newUser._doc;
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .cookie("token", token, { httpOnly: true, expiresIn: "1d" })
        .status(200)
        .json({
          success: true,
          userData,
          token,
          message: "Registered successfully",
        });
    }
  } catch (err) {
    next(new ErrorHandler(`Something went wrong!`, 404));
  }
};
// reset password functinality--
exports.updatePassword = async (req, res, next) => {
  // get request data--
  const { prevPassword, newPassword, confirmPassword } = req.body;

  if (prevPassword === "" || newPassword === "" || confirmPassword === "") {
    next(new ErrorHandler("Please enter valid data", 404));
    return;
  }

  // find user by id--
  const user = await User.findById(req.user.id);
  //  compare password--
  const isPasswordMatched = bcrypt.compareSync(prevPassword, user.password);
  // handler password mismatch--
  if (!isPasswordMatched) {
    next(new ErrorHandler("Incorrect password", 403));
    return;
  }
  // validate new password and confirm password--
  if (newPassword !== confirmPassword) {
    next(new ErrorHandler("Passwords do not match", 409));
    return;
  }
  try {
    // generate salt and hash new password--
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const user = await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword,
    });
    // find user and update password--
    const { password: hashedPassword1, ...userData } = user._doc;
    // return updated user data--
    res.status(201).json({
      success: true,
      data: userData,
      message: "Password updated successfully",
    });
  } catch (err) {
    next(new ErrorHandler(`Something went wrong!`, 500));
  }
};
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      next(new ErrorHandler("User not found!", 404));
      return;
    }
    // generate reset password token--
    const resetToken = crypto.randomBytes(20).toString("hex");
    // saving token to the user doc--
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    // reset password url--
    const resetPasswordUrl = `${frontendUrl}/resetPassword/${resetToken}`;
    // reset password message--
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n Alert! If you have not requested this email then please ignore this email. Otherwise you can good to go.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Recovery E-mail",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Message sent to ${user.email} successfully.`,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(err, 500));
    }
  } catch (err) {
    next(new ErrorHandler(`Something went wrong!`, 500));
  }
};
// reset password functionality--
exports.resetPassword = async (req, res, next) => {
  try {
    // const resetToken = req.body.params;
    const resetToken = req.body.token;
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({ email: req.body.email });
    // cheack if user exists--
    if (!user) {
      next(new ErrorHandler("User not found!", 404));
      return;
    }
    // check reset password token--
    if (user.resetPasswordToken !== resetPasswordToken) {
      next(new ErrorHandler("Token is invalid. Please try again.", 404));
      return;
    }
    // check reset password token is expired or not--
    if (user.resetPasswordExpires < Date.now()) {
      next(new ErrorHandler("Your token has been expired. Please try again."));
      return;
    }
    // check new password and confirm password are same or not--
    if (req.body.password !== req.body.confirmPassword) {
      next(
        new ErrorHandler(
          "New password and confirm password should be the same!",
          404
        )
      );
      return;
    }
    // save the password--
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "password reseted successfully",
    });
  } catch (err) {
    next(new ErrorHandler(`Something went wrong!`, 500));
  }
};
