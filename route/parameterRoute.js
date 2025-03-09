const express = require("express");
const {getParametersByGroup} = require("../controller/parameterController.js");
const router = express.Router();


router.get('/group/:group', getParametersByGroup);

module.exports = router;