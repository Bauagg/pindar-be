const express = require("express");
const {createCardPublisher, getCardPublishers, getCardPublisherById, updateCardPublisher, deleteCardPublisher} = require("../controller/creditCardController.js");
const {createCardFeature, getCardFeatures, getCardFeatureById, updateCardFeature, deleteCardFeature} = require("../controller/creditCardController.js");
const {bulkCreateCardFeatures, bulkCreateCardPublishers} = require("../controller/creditCardController");

const router = express.Router();

router.post('/card-publisher', createCardPublisher);
router.get('/card-publisher', getCardPublishers);
router.get('/card-publisher/:id', getCardPublisherById);
router.put('/card-publisher/:id', updateCardPublisher);
router.delete('/card-publisher/:id', deleteCardPublisher);
router.post('/card-publisher/bulk', bulkCreateCardPublishers);

router.post('/card-feature', createCardFeature);
router.get('/card-feature', getCardFeatures);
router.get('/card-feature/:id', getCardFeatureById);
router.put('/card-feature/:id', updateCardFeature);
router.delete('/card-feature/:id', deleteCardFeature);
router.post('/card-feature/bulk', bulkCreateCardFeatures);

module.exports = router;