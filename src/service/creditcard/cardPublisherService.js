import {
    getAllCardPublishers,
    getCardPublisherById, insertBulkCardPublishers,
    insertCardPublisher, softDeleteCardPublisherById, updateCardPublisherById
} from "../../repository/cardPublisherRepository.js";


export const addCardPublisher = async (data) => {
    const { number, publisherName } = data;

    if (!number || !publisherName) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    return await insertCardPublisher({ number, publisherName });
};

export const fetchCardPublishers = async () => {
    return await getAllCardPublishers();
};

export const fetchCardPublisherById = async (id) => {
    const publisher = await getCardPublisherById(id);
    if (!publisher) throw { status: 404, message: 'Card publisher not found.' };
    return publisher;
};

export const modifyCardPublisher = async (id, data) => {
    const { number, publisherName } = data;
    if (!number || !publisherName) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    return await updateCardPublisherById(id, { number, publisherName });
};

export const softDeleteCardPublisher = async (id) => {
    await softDeleteCardPublisherById(id);
};

export const addBulkCardPublishers = async (publishers) => {
    if (!Array.isArray(publishers.publishers) || publishers.publishers.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of publishers.' };
    }

    return await insertBulkCardPublishers(publishers.publishers);
};