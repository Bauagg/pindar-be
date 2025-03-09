import {
    addBulkCardPublishers,
    addCardPublisher,
    fetchCardPublisherById,
    fetchCardPublishers, modifyCardPublisher, softDeleteCardPublisher
} from "../service/creditcard/cardPublisherService.js";
import {
    addBulkCardFeaturesService,
    addCardFeature,
    fetchCardFeatureById,
    fetchCardFeatures,
    modifyCardFeature, removeCardFeature
} from "../service/creditcard/cardFeatureService.js";


export const createCardPublisher = async (req, res, next) => {
    try {
        const publisher = await addCardPublisher(req.body);
        res.status(201).json({ code: 201, message: 'Card publisher created successfully.', data: publisher });
    } catch (err) {
        next(err);
    }
};

export const getCardPublishers = async (req, res, next) => {
    try {
        const publishers = await fetchCardPublishers();
        res.status(200).json({ code: 200, message: 'Card publishers retrieved successfully.', data: publishers });
    } catch (err) {
        next(err);
    }
};

export const getCardPublisherById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const publisher = await fetchCardPublisherById(id);
        res.status(200).json({ code: 200, message: 'Card publisher retrieved successfully.', data: publisher });
    } catch (err) {
        next(err);
    }
};

export const updateCardPublisher = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedPublisher = await modifyCardPublisher(id, req.body);
        res.status(200).json({ code: 200, message: 'Card publisher updated successfully.', data: updatedPublisher });
    } catch (err) {
        next(err);
    }
};

export const deleteCardPublisher = async (req, res, next) => {
    try {
        const { id } = req.params;
        await softDeleteCardPublisher(id);
        res.status(200).json({ code: 200, message: 'Card publisher deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

export const createCardFeature = async (req, res, next) => {
    try {
        const feature = await addCardFeature(req.body);
        res.status(201).json({ code: 201, message: 'Card feature created successfully.', data: feature });
    } catch (err) {
        next(err);
    }
};

export const getCardFeatures = async (req, res, next) => {
    try {
        const features = await fetchCardFeatures();
        res.status(200).json({ code: 200, message: 'Card features retrieved successfully.', data: features });
    } catch (err) {
        next(err);
    }
};

export const getCardFeatureById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const feature = await fetchCardFeatureById(id);
        res.status(200).json({ code: 200, message: 'Card feature retrieved successfully.', data: feature });
    } catch (err) {
        next(err);
    }
};

export const updateCardFeature = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFeature = await modifyCardFeature(id, req.body);
        res.status(200).json({ code: 200, message: 'Card feature updated successfully.', data: updatedFeature });
    } catch (err) {
        next(err);
    }
};

export const deleteCardFeature = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removeCardFeature (id);
        res.status(200).json({ code: 200, message: 'Card feature deleted successfully.' });
    } catch (err) {
        next(err);
    }
}

export const bulkCreateCardFeatures = async (req, res, next) => {
    try {
        const features = await addBulkCardFeaturesService(req.body);
        res.status(201).json({ code: 201, message: 'Card features created successfully.', data: features });
    } catch (err) {
        next(err);
    }
};

export const bulkCreateCardPublishers = async (req, res, next) => {
    try {
        const publishers = await addBulkCardPublishers(req.body);
        res.status(201).json({ code: 201, message: 'Card publishers created successfully.', data: publishers });
    } catch (err) {
        next(err);
    }
};