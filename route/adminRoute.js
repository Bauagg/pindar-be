const express = require("express");
const {adminSignIn, addUser} = require("../controller/adminController");
const router = express.Router();

router.post("/sign-in", adminSignIn);
router.post("/add", addUser);

module.exports = router;