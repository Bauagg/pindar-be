const express = require("express");
const {createCardPublisher, getCardPublishers, getCardPublisherById, updateCardPublisher, deleteCardPublisher} = require("../controller/creditCardController.js");

const router = express.Router();

router.post('/card-publisher', createCardPublisher);
router.get('/card-publisher', getCardPublishers);
router.get('/card-publisher/:id', getCardPublisherById);
router.put('/card-publisher/:id', updateCardPublisher);
router.delete('/card-publisher/:id', deleteCardPublisher);

module.exports = router;