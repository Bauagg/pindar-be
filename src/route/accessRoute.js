import express from "express";
import { refreshToken, logout } from "../controller/userController.js";

const router = express.Router();

router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
