const express = require("express");
const {addLender} = require("../controller/lenderController.js");
const {updateLender} = require("../controller/lenderController.js");
const {deleteLender} = require("../controller/lenderController.js");
const {listLenders} = require("../controller/lenderController.js");
const {getLenderDetail} = require("../controller/lenderController.js");
const router = express.Router();


router.post('/add', addLender);
router.put('/update', updateLender);
router.delete('/delete/:id', deleteLender);
router.get('/list', listLenders);
router.get('/detail/:id', getLenderDetail);

module.exports = router;