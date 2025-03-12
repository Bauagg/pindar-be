import {
    deleteContentById,
    getContentById,
    getContentList,
    insertContent,
    updateContentById
} from "../../repository/contentRepository.js";


export const addContent = async (data) => {
    const { title, categoryId, contentDetail, linkPath, imageId } = data;

    if (!title || !categoryId || !contentDetail || !linkPath) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    return await insertContent({ title, categoryId, contentDetail, linkPath, imageId });
};

export const addBulkContent = async (contents) => {
    if (!Array.isArray(contents) || contents.length === 0) {
        throw { status: 400, message: 'Invalid input, expected an array of contents.' };
    }

    return await insertBulkContent(contents);
};

export const fetchContentById = async (id) => {
    const content = await getContentById(id);
    if (!content) throw { status: 404, message: 'Content not found.' };
    return content;
};

export const fetchContentList = async (limit, offset, sortBy, sortDirection) => {
    return await getContentList(limit, offset, sortBy, sortDirection);
};

export const modifyContent = async (id, data) => {
    const { title, categoryId, contentDetail, linkPath, imageId } = data;
    if (!title || !categoryId || !contentDetail || !linkPath) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    return await updateContentById(id, { title, categoryId, contentDetail, linkPath, imageId });
};

export const removeContent = async (id) => {
    await deleteContentById(id);
};