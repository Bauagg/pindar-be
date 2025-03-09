const express = require("express");
const {adminSignIn, addUser, updateUser, deleteUser, listUsers, getUserDetail} = require("../controller/adminController");
const router = express.Router();

router.post("/sign-in", adminSignIn);
router.post("/add", addUser);
router.put("/edit", updateUser);
router.delete("/delete", deleteUser);
router.get("/list", listUsers);
router.get("/detail/:id", getUserDetail);

module.exports = router;