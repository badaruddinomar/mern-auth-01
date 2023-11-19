const express = require("express");
const router = express.Router();
const {
  updateUser,
  signout,
  deleteAcount,
  profile,
} = require("../controllers/userController");
const { verifyToken } = require("../utils/verifyUser");

router.route("/profile").get(verifyToken, profile);
router.route("/updateProfile/:id").patch(verifyToken, updateUser);
router.route("/signout").get(verifyToken, signout);
router.route("/deleteAccount").delete(verifyToken, deleteAcount);

module.exports = router;
