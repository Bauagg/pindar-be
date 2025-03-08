const express = require("express");
const {addLender} = require("../controller/lenderController.js");
const router = express.Router();


router.post('/add', addLender);

module.exports = router;