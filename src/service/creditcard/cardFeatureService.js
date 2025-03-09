import {
    deleteCardFeatureById,
    getAllCardFeatures,
    getCardFeatureById, insertBulkCardFeatures,
    insertCardFeature,
    updateCardFeatureById
} from "../../repository/cardFeatureRepository.js";

export const addCardFeature = async (data) => {
    const { featureName } = data;

    if (!featureName) {
        throw { status: 400, message: 'Missing required field: featureName.' };
    }

    return await insertCardFeature({ featureName });
};

export const fetchCardFeatures = async () => {
    return await getAllCardFeatures();
};

export const fetchCardFeatureById = async (id) => {
    const feature = await getCardFeatureById(id);
    if (!feature) throw { status: 404, message: 'Card feature not found.' };
    return feature;
};

export const modifyCardFeature = async (id, data) => {
    const { featureName } = data;
    if (!featureName) {
        throw { status: 400, message: 'Missing required field: featureName.' };
    }

    return await updateCardFeatureById(id, { featureName });
};

export const removeCardFeature = async (id) => {
    await deleteCardFeatureById(id);
};

export const addBulkCardFeaturesService = async (features) => {
    if (!Array.isArray(features.features) || features.features.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of features.' };
    }

    return await insertBulkCardFeatures(features.features);
};