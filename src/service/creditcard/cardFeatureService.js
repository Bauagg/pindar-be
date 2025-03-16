import {
    deleteCardFeatureById,
    getAllCardFeatures,
    getCardFeatureById,
    insertBulkCardFeatures,
    insertCardFeature,
    updateCardFeatureById
} from "../../repository/cardFeatureRepository.js";

export const addCardFeature = async (data) => {
    const { featureName } = data;

    if (!featureName) {
        throw { status: 400, message: 'Missing required field: featureName.' };
    }

    const feature = await insertCardFeature({ featureName });

    return formatFeatureResponse(feature);
};

export const fetchCardFeatures = async () => {
    const features = await getAllCardFeatures();
    return features.map(formatFeatureResponse);
};

export const fetchCardFeatureById = async (id) => {
    const feature = await getCardFeatureById(id);
    if (!feature) throw { status: 404, message: 'Card feature not found.' };

    return formatFeatureResponse(feature);
};

export const modifyCardFeature = async (id, data) => {
    const { featureName } = data;
    if (!featureName) {
        throw { status: 400, message: 'Missing required field: featureName.' };
    }

    const updatedFeature = await updateCardFeatureById(id, { featureName });

    return formatFeatureResponse(updatedFeature);
};

export const removeCardFeature = async (id) => {
    await deleteCardFeatureById(id);
};

export const addBulkCardFeaturesService = async (features) => {
    if (!Array.isArray(features.features) || features.features.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of features.' };
    }

    const insertedFeatures = await insertBulkCardFeatures(features.features);

    return insertedFeatures.map(formatFeatureResponse);
};

// ✅ Helper function to format response in camelCase
const formatFeatureResponse = (feature) => ({
    id: feature.id,
    featureName: feature.feature_name
});
