import express from "express";
import {
    adminSignIn,
    addUser,
    updateUser,
    deleteUser,
    listUsers,
    getUserDetail
} from "../controller/adminController.js";

const router = express.Router();

router.post("/sign-in", adminSignIn);
router.post("/add", addUser);
router.put("/edit", updateUser);
router.delete("/delete", deleteUser);
router.get("/list", listUsers);
router.get("/detail/:id", getUserDetail);

export default router;
