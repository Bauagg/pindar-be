const express = require("express");
const {getUsers, signUp, confirmOtp, loginUser} = require("../controller/userController");
const router = express.Router();


router.get("/all", getUsers);
router.post("/sign-up", signUp);
router.post("/confirm-otp", confirmOtp);
router.post("/sign-in", loginUser);

module.exports = router;
