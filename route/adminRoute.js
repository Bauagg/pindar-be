const express = require("express");
const {adminSignIn} = require("../controller/adminController");
const router = express.Router();

router.post("/sign-in", adminSignIn);

module.exports = router;