const express = require("express");
const {refreshToken} = require("../controller/userController.js");
const router = express.Router();


router.post("/refresh-token", refreshToken);

module.exports = router;