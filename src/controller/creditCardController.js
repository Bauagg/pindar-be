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
    fetchCreditCardById, fetchCreditCardsList,
    modifyCreditCard, recordProductAccess, removeCreditCard
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
        const {
            limit = 10,
            offset = 0,
            search = ""
        } = req.query;

        const publishers = await fetchCardPublishers(
            parseInt(limit, 10),
            parseInt(offset, 10),
            search
        );

        res.status(200).json({
            code: 200,
            message: 'Card publishers retrieved successfully.',
            data: publishers
        });
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
        const {
            limit = 10,
            offset = 0,
            search = ""
        } = req.query;

        const features = await fetchCardFeatures(
            parseInt(limit, 10),
            parseInt(offset, 10),
            search
        );

        res.status(200).json({
            code: 200,
            message: 'Card features retrieved successfully.',
            data: features
        });
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

        let userId = null;
        if (req.user) {
            userId = req.user.id;
        }

        // Record the product access asynchronously
        recordProductAccess('credit_card', id, userId, req).catch(error => {
            console.error('Failed to record product access:', error);
        });

        res.status(200).json({ code: 200, message: 'Credit card retrieved successfully.', data: creditCard });
    } catch (err) {
        next(err);
    }
};

export const getCreditCardList = async (req, res, next) => {
    try {
        const {
            limit = 10,
            offset = 0,
            search = '',
            publisherIds,
            featureIds,
            minYearlyFee,
            maxYearlyFee,
            minYearlyIncome,
            maxYearlyIncome,
            sortBy,
            sortDirection
        } = req.query;

        const filters = {
            publisherIds: publisherIds
                ? publisherIds
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => /^[0-9a-fA-F\-]{36}$/.test(id)) // Basic UUID v4 format check
                : [],
            featureIds: featureIds
                ? featureIds
                    .split(',')
                    .map(id => id.trim())
                    .filter(id => /^[0-9a-fA-F\-]{36}$/.test(id)) // Basic UUID v4 format check
                : [],
            minYearlyFee: minYearlyFee ? parseFloat(minYearlyFee) : undefined,
            maxYearlyFee: maxYearlyFee ? parseFloat(maxYearlyFee) : undefined,
            minYearlyIncome: minYearlyIncome ? parseFloat(minYearlyIncome) : undefined,
            maxYearlyIncome: maxYearlyIncome ? parseFloat(maxYearlyIncome) : undefined,
            sortBy,
            sortDirection,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            search
        };
        const creditCards = await fetchCreditCardsList(filters);

        res.status(200).json({
            code: 200,
            message: 'Credit card list retrieved successfully.',
            data: creditCards
        });
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
        const filters = {
            publisherId: req.query.publisherId,
            featureIds: req.query.featureIds
                ? req.query.featureIds.split(',').map(id => id.trim()).filter(id => /^[0-9a-fA-F\-]{36}$/.test(id))
                : [],
            minYearlyFee: req.query.minYearlyFee ? parseFloat(req.query.minYearlyFee) : undefined,
            maxYearlyFee: req.query.maxYearlyFee ? parseFloat(req.query.maxYearlyFee) : undefined,
            minYearlyIncome: req.query.minYearlyIncome ? parseFloat(req.query.minYearlyIncome) : undefined,
            maxYearlyIncome: req.query.maxYearlyIncome ? parseFloat(req.query.maxYearlyIncome) : undefined,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
            offset: req.query.offset ? parseInt(req.query.offset, 10) : 0
        };

        const result = await fetchCreditCardsList(filters);

        res.status(200).json({
            code: 200,
            message: "Credit cards retrieved successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
