const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authentication");
const { currentUser, updateUser, changePassword } = require("../controllers/user");

//* Current User
router.get("/", verifyToken, currentUser);
//* Update User
router.put("/", verifyToken, updateUser);
//* Change Password
router.put("/password", verifyToken, changePassword);

module.exports = router;
