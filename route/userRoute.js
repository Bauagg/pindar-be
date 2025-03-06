const express = require("express");
const {signUp, confirmOtp, loginUser, listCustomers} = require("../controller/userController");
const router = express.Router();


router.get("/list", listCustomers);
router.post("/sign-up", signUp);
router.post("/confirm-otp", confirmOtp);
router.post("/sign-in", loginUser);

module.exports = router;
