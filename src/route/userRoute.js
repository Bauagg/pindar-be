import express from "express";
import {
    signUp,
    confirmOtp,
    loginUser,
    listCustomers,
    updateCustomerStatus,
    updateCustomer,
    changePassword,
    getCustomerDetail, forgotPasswordHandler
} from "../controller/userController.js"; // Ensure .js extension is included

const router = express.Router();

router.get("/list", listCustomers);
router.post("/sign-up", signUp);
router.post("/confirm-otp", confirmOtp);
router.post("/sign-in", loginUser);
router.put("/update-status", updateCustomerStatus);
router.put("/update", updateCustomer);
router.put("/change-password", changePassword);
router.get("/profile", getCustomerDetail);
router.post("/forgot-password", forgotPasswordHandler)

export default router; // ✅ Use ES module export instead of module.exports
