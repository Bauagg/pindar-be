import {
    addBulkContentCategories, addContentCategory, fetchContentCategories, fetchContentCategoryById,
    modifyContentCategory,
    removeContentCategory
} from "../service/content/contentCategoryService.js";


export const createContentCategory = async (req, res, next) => {
    try {
        const category = await addContentCategory(req.body);
        res.status(201).json({ code: 201, message: 'Content category created successfully.', data: category });
    } catch (err) {
        next(err);
    }
};

export const getContentCategories = async (req, res, next) => {
    try {
        const categories = await fetchContentCategories();
        res.status(200).json({ code: 200, message: 'Content categories retrieved successfully.', data: categories });
    } catch (err) {
        next(err);
    }
};

export const getContentCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await fetchContentCategoryById(id);
        res.status(200).json({ code: 200, message: 'Content category retrieved successfully.', data: category });
    } catch (err) {
        next(err);
    }
};

export const updateContentCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCategory = await modifyContentCategory(id, req.body);
        res.status(200).json({ code: 200, message: 'Content category updated successfully.', data: updatedCategory });
    } catch (err) {
        next(err);
    }
};

export const deleteContentCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removeContentCategory(id);
        res.status(200).json({ code: 200, message: 'Content category deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

export const bulkCreateContentCategories = async (req, res, next) => {
    try {
        const categories = await addBulkContentCategories(req.body.categories);
        res.status(201).json({ code: 201, message: 'Content categories created successfully.', data: categories });
    } catch (err) {
        next(err);
    }
};