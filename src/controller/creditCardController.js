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
import {
    addCreditCard,
    fetchCreditCardById,
    fetchCreditCardList, fetchCreditCards,
    modifyCreditCard, removeCreditCard
} from "../service/creditcard/creditCardService.js";


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

export const createCreditCard = async (req, res, next) => {
    try {
        const createdBy = req.user.email; // Extract from JWT middleware
        const creditCard = await addCreditCard({ ...req.body, createdBy });

        res.status(201).json({ code: 201, message: 'Credit card created successfully.', data: creditCard });
    } catch (err) {
        next(err);
    }
};

export const getCreditCardById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const creditCard = await fetchCreditCardById(id);
        res.status(200).json({ code: 200, message: 'Credit card retrieved successfully.', data: creditCard });
    } catch (err) {
        next(err);
    }
};

export const getCreditCardList = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0, search = '' } = req.query;
        const creditCards = await fetchCreditCardList(parseInt(limit, 10), parseInt(offset, 10), search);
        res.status(200).json({ code: 200, message: 'Credit card list retrieved successfully.', data: creditCards });
    } catch (err) {
        next(err);
    }
};

export const updateCreditCard = async (req, res, next) => {
    try {
        const updatedBy = req.user.email; // Extract from JWT middleware
        const { id } = req.params;
        const updatedCard = await modifyCreditCard(id, { ...req.body, updatedBy });

        res.status(200).json({ code: 200, message: 'Credit card updated successfully.', data: updatedCard });
    } catch (err) {
        next(err);
    }
};

export const deleteCreditCard = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removeCreditCard(id);
        res.status(200).json({ code: 200, message: 'Credit card deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

export const searchCreditCards = async (req, res, next) => {
    try {
        const {
            publisherId, featureId, minYearlyFee, maxYearlyFee,
            minYearlyIncome, maxYearlyIncome, sortBy = 'title',
            sortDirection = 'asc', limit = 10, offset = 0
        } = req.query;

        const creditCards = await fetchCreditCards({
            publisherId, featureId, minYearlyFee, maxYearlyFee,
            minYearlyIncome, maxYearlyIncome, sortBy, sortDirection,
            limit: parseInt(limit, 10), offset: parseInt(offset, 10)
        });

        res.status(200).json({
            code: 200,
            message: 'Credit card list retrieved successfully.',
            data: creditCards
        });
    } catch (err) {
        next(err);
    }
};