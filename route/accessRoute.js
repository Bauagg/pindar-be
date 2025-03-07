const express = require("express");
const {refreshToken} = require("../controller/userController.js");
const {logout} = require("../controller/userController.js");
const router = express.Router();


router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;