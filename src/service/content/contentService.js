import {
    deleteContentById,
    getContentById,
    getContentList,
    insertContent,
    updateContentById
} from "../../repository/contentRepository.js";
import {getParameterByKey} from "../../repository/parameterRepository.js";
import {createNotification} from "../../repository/notificationRepository.js";

export const addContent = async (data) => {
    const { title, categoryId, contentDetail, linkPath, imageId } = data;

    if (!title || !categoryId || !contentDetail || !linkPath) {
        throw { status: 400, message: "Missing required fields." };
    }

    const notificationParam = await getParameterByKey("CONTENT_NOTIFICATION_TITLE");
    const notificationTitle = notificationParam ? notificationParam.param_value : "New Content Published";

    const content = await insertContent({ title, categoryId, contentDetail, linkPath, imageId });

    await createNotification({
        userId: null,
        title: notificationTitle,
        detail: `Check out our latest content: ${title}`,
        link: `/content/${content.id}`
    });

    return formatContentResponse(content);
};

export const fetchContentById = async (id) => {
    const content = await getContentById(id);
    if (!content) throw { status: 404, message: 'Content not found.' };
    const response = formatContentResponse(content);
    if (response.imageLink !== null) {
        const match = response.imageLink.match(/[0-9a-fA-F\-]{36}/);
        if (match) {
            const uuid = match[0];
            response.imageId = uuid;
        }
    }
    return response
};

export const fetchContentList = async (limit, offset, search, sortBy, sortDirection, categoryId) => {
    const contents = await getContentList(limit, offset, search, sortBy, sortDirection, categoryId);

    return {
        contents: contents.contents.map(formatContentResponse),
        pagination: {
            total: contents.pagination.total,
            totalPages: contents.pagination.totalPages,
            currentPage: contents.pagination.currentPage,
            size: contents.pagination.size
        }
    };
};

export const modifyContent = async (id, data) => {
    const { title, categoryId, contentDetail, linkPath, imageId } = data;

    if (!title || !categoryId || !contentDetail || !linkPath) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    const updatedContent = await updateContentById(id, { title, categoryId, contentDetail, linkPath, imageId });

    return formatContentResponse(updatedContent);
};

export const removeContent = async (id) => {
    await deleteContentById(id);
};

// ✅ Helper function to format response in camelCase
const formatContentResponse = (content) => ({
    id: content.id,
    title: content.title,
    categoryId: content.category_id,
    categoryName: content.category_name,
    contentDetail: content.content_detail,
    linkPath: content.link_path,
    imageLink: content.image_id ? `/file/image/${content.image_id}` : content.image_link,
    createdDate: content.created_date,
    updatedDate: content.updated_date
});
