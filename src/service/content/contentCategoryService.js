import {
    deleteContentCategoryById,
    getAllContentCategories,
    getContentCategoryById, insertBulkContentCategories,
    insertContentCategory, updateContentCategoryById
} from "../../repository/contentCategoryRepository.js";


export const addContentCategory = async (data) => {
    const { name } = data;

    if (!name) {
        throw { status: 400, message: 'Missing required field: name.' };
    }

    return await insertContentCategory({ name });
};

export const fetchContentCategories = async () => {
    return await getAllContentCategories();
};

export const fetchContentCategoryById = async (id) => {
    const category = await getContentCategoryById(id);
    if (!category) throw { status: 404, message: 'Content category not found.' };
    return category;
};

export const modifyContentCategory = async (id, data) => {
    const { name } = data;
    if (!name) {
        throw { status: 400, message: 'Missing required field: name.' };
    }

    return await updateContentCategoryById(id, { name });
};

export const removeContentCategory = async (id) => {
    await deleteContentCategoryById(id);
};

export const addBulkContentCategories = async (categories) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of categories.' };
    }

    return await insertBulkContentCategories(categories);
};