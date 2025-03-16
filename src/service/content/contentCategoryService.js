import {
    deleteContentCategoryById,
    getAllContentCategories,
    getContentCategoryById,
    insertBulkContentCategories,
    insertContentCategory,
    updateContentCategoryById
} from "../../repository/contentCategoryRepository.js";

export const addContentCategory = async (data) => {
    const { name } = data;

    if (!name) {
        throw { status: 400, message: 'Missing required field: name.' };
    }

    const category = await insertContentCategory({ name });

    return formatCategoryResponse(category);
};

export const fetchContentCategories = async () => {
    const categories = await getAllContentCategories();
    return categories.map(formatCategoryResponse);
};

export const fetchContentCategoryById = async (id) => {
    const category = await getContentCategoryById(id);
    if (!category) throw { status: 404, message: 'Content category not found.' };

    return formatCategoryResponse(category);
};

export const modifyContentCategory = async (id, data) => {
    const { name } = data;
    if (!name) {
        throw { status: 400, message: 'Missing required field: name.' };
    }

    const updatedCategory = await updateContentCategoryById(id, { name });

    return formatCategoryResponse(updatedCategory);
};

export const removeContentCategory = async (id) => {
    await deleteContentCategoryById(id);
};

export const addBulkContentCategories = async (categories) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of categories.' };
    }

    const insertedCategories = await insertBulkContentCategories(categories);

    return insertedCategories.map(formatCategoryResponse);
};

// ✅ Helper function to format response in camelCase
const formatCategoryResponse = (category) => ({
    id: category.id,
    name: category.name
});
