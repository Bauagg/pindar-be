import {
    checkFeatureExists,
    checkPublisherExists,
    deleteCreditCardById,
    getCreditCardById, getCreditCardList,
    insertCreditCard,
    updateCreditCardById
} from "../../repository/creditCardRepository.js";


export const addCreditCard = async (data) => {
    const publisherExists = await checkPublisherExists(data.publisherId);
    if (!publisherExists) {
        throw { status: 400, message: 'Invalid publisherId. Publisher does not exist.' };
    }

    const featureExists = await checkFeatureExists(data.featureTypeId);
    if (!featureExists) {
        throw { status: 400, message: 'Invalid featureTypeId. Feature does not exist.' };
    }

    return await insertCreditCard(data);
};

export const fetchCreditCardById = async (id) => {
    return await getCreditCardById(id);
};

export const fetchCreditCardList = async (limit, offset, search) => {
    return await getCreditCardList(limit, offset, search);
};

export const modifyCreditCard = async (id, data) => {
    const publisherExists = await checkPublisherExists(data.publisherId);
    if (!publisherExists) {
        throw { status: 400, message: 'Invalid publisherId. Publisher does not exist.' };
    }

    const featureExists = await checkFeatureExists(data.featureTypeId);
    if (!featureExists) {
        throw { status: 400, message: 'Invalid featureTypeId. Feature does not exist.' };
    }

    return await updateCreditCardById(id, data);
};

export const removeCreditCard = async (id) => {
    await deleteCreditCardById(id);
};
