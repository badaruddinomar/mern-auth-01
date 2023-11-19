const express = require("express");
const {
  signUp,
  login,
  googleAuth,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();
const { verifyToken } = require("../utils/verifyUser");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/auth/google").post(googleAuth);
router.route("/updatePassword").patch(verifyToken, updatePassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

module.exports = router;
