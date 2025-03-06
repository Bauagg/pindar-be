const express = require("express");
const {adminSignIn, addUser, updateUser, deleteUser} = require("../controller/adminController");
const router = express.Router();

router.post("/sign-in", adminSignIn);
router.post("/add", addUser);
router.put("/edit", updateUser);
router.delete("/delete", deleteUser);

module.exports = router;