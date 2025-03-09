import {
    addContent,
    fetchContentById,
    fetchContentList,
    modifyContent,
    removeContent
} from "../service/content/contentService.js";


export const createContent = async (req, res, next) => {
    try {
        const content = await addContent(req.body);
        res.status(201).json({ code: 201, message: 'Content created successfully.', data: content });
    } catch (err) {
        next(err);
    }
};

export const bulkCreateContent = async (req, res, next) => {
    try {
        const contents = await addBulkContent(req.body);
        res.status(201).json({ code: 201, message: 'Contents created successfully.', data: contents });
    } catch (err) {
        next(err);
    }
};

export const getContentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const content = await fetchContentById(id);
        res.status(200).json({ code: 200, message: 'Content retrieved successfully.', data: content });
    } catch (err) {
        next(err);
    }
};

export const getContentList = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0, sortBy = 'created_date', sortDirection = 'desc' } = req.query;
        const contentList = await fetchContentList(parseInt(limit, 10), parseInt(offset, 10), sortBy, sortDirection);
        res.status(200).json({ code: 200, message: 'Content list retrieved successfully.', data: contentList });
    } catch (err) {
        next(err);
    }
};

export const updateContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedContent = await modifyContent(id, req.body);
        res.status(200).json({ code: 200, message: 'Content updated successfully.', data: updatedContent });
    } catch (err) {
        next(err);
    }
};

export const deleteContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removeContent(id);
        res.status(200).json({ code: 200, message: 'Content deleted successfully.' });
    } catch (err) {
        next(err);
    }
};