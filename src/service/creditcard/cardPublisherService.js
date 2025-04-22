import {
    getAllCardPublishers,
    getCardPublisherById,
    insertBulkCardPublishers,
    insertCardPublisher,
    softDeleteCardPublisherById,
    updateCardPublisherById
} from "../../repository/cardPublisherRepository.js";

export const addCardPublisher = async (data) => {
    const { number, publisherName } = data;

    if (!number || !publisherName) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    const publisher = await insertCardPublisher({ number, publisherName });

    return formatPublisherResponse(publisher);
};

export const fetchCardPublishers = async (limit, offset, search) => {
    const result = await getAllCardPublishers(limit, offset, search);
    return {
        publishers: result.publishers.map(formatPublisherResponse),
        pagination: result.pagination
    };
};


export const fetchCardPublisherById = async (id) => {
    const publisher = await getCardPublisherById(id);
    if (!publisher) throw { status: 404, message: 'Card publisher not found.' };

    return formatPublisherResponse(publisher);
};

export const modifyCardPublisher = async (id, data) => {
    const { number, publisherName } = data;

    if (!number || !publisherName) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    const updatedPublisher = await updateCardPublisherById(id, { number, publisherName });

    return formatPublisherResponse(updatedPublisher);
};

export const softDeleteCardPublisher = async (id) => {
    await softDeleteCardPublisherById(id);
};

export const addBulkCardPublishers = async (publishers) => {
    if (!Array.isArray(publishers.publishers) || publishers.publishers.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of publishers.' };
    }

    const insertedPublishers = await insertBulkCardPublishers(publishers.publishers);

    return insertedPublishers.map(formatPublisherResponse);
};

// ✅ Helper function to format response in camelCase
const formatPublisherResponse = (publisher) => ({
    id: publisher.id,
    number: publisher.number,
    publisherName: publisher.publisher_name
});
