const express = require("express");
const {getUsers, signUp, confirmOtp} = require("../controller/userController");
const router = express.Router();


router.get("/all", getUsers);
router.post("/sign-up", signUp);
router.post("/confirm-otp", confirmOtp);

module.exports = router;
