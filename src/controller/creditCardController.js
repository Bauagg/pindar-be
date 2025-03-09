import {
    addCardPublisher,
    fetchCardPublisherById,
    fetchCardPublishers, modifyCardPublisher, softDeleteCardPublisher
} from "../service/creditcard/cardPublisherService.js";


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
