const ErrorHandler = require("../utils/errorHandler");
const User = require("./../models/userModel");

exports.profile = async (req, res, next) => {
  try {
    if (!req.user) {
      next(new ErrorHandler("user not found!", 404));
      return;
    }
    const user = await User.findById(req?.user?.id);

    if (user) {
      const { password: hashedPassword, ...userData } = user?._doc;

      res.status(200).json({
        success: true,
        data: userData,
      });
    } else {
      next(new ErrorHandler("No user found", 400));
      return;
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Somthing went wrong!",
    });
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const { username, email, profilePicture } = req.body;
    if (username === "" || email === "") {
      next(new ErrorHandler("Please enter valid data!", 404));
      return;
    }
    const user = await User.findByIdAndUpdate(req?.user.id, {
      username: username,
      email: email,
      profilePicture,
    });
    const { password: hashedPassword, ...userData } = user._doc;
    res.status(201).json({
      success: true,
      message: "Updated successfully",
      userData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Somthing went wrong!",
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res.cookie("token", null).status(200).json({
      success: true,
      message: "Successfully sign out!",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Somthing went wrong!",
    });
  }
};

exports.deleteAcount = async (req, res) => {
  try {
    const id = req.user.id;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Account deleted",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Somthing went wrong!",
    });
  }
};
