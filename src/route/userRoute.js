const express = require("express");
const {signUp, confirmOtp, loginUser, listCustomers, updateCustomerStatus, updateCustomer, changePassword,
    getCustomerDetail
} = require("../controller/userController");
const router = express.Router();


router.get("/list", listCustomers);
router.post("/sign-up", signUp);
router.post("/confirm-otp", confirmOtp);
router.post("/sign-in", loginUser);
router.put("/update-status", updateCustomerStatus);
router.put("/update", updateCustomer);
router.put("/change-password", changePassword);
router.get("/profile", getCustomerDetail);

module.exports = router;
