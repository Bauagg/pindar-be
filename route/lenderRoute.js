const express = require("express");
const {addLender} = require("../controller/lenderController.js");
const {updateLender} = require("../controller/lenderController.js");
const router = express.Router();


router.post('/add', addLender);
router.put('/update', updateLender);

module.exports = router;