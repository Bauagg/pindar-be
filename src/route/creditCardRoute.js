import express from "express";
import {
    createCardPublisher,
    getCardPublishers,
    getCardPublisherById,
    updateCardPublisher,
    deleteCardPublisher,
    createCardFeature,
    getCardFeatures,
    getCardFeatureById,
    updateCardFeature,
    deleteCardFeature,
    bulkCreateCardFeatures,
    bulkCreateCardPublishers
} from "../controller/creditCardController.js";

const router = express.Router();

router.post("/card-publisher", createCardPublisher);
router.get("/card-publisher", getCardPublishers);
router.get("/card-publisher/:id", getCardPublisherById);
router.put("/card-publisher/:id", updateCardPublisher);
router.delete("/card-publisher/:id", deleteCardPublisher);
router.post("/card-publisher/bulk", bulkCreateCardPublishers);

router.post("/card-feature", createCardFeature);
router.get("/card-feature", getCardFeatures);
router.get("/card-feature/:id", getCardFeatureById);
router.put("/card-feature/:id", updateCardFeature);
router.delete("/card-feature/:id", deleteCardFeature);
router.post("/card-feature/bulk", bulkCreateCardFeatures);

export default router;
