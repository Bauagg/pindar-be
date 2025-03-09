import {
    deleteCommentById,
    getCommentList,
    getCommentReplies,
    getCommentsByContentId,
    insertComment
} from "../../repository/commentRepository.js";



export const addComment = async ({ contentId, parentCommentId, userId, comment }) => {
    if (!contentId || !userId) {
        throw { status: 400, message: 'Missing required fields: contentId, userId.' };
    }
    return await insertComment({ contentId, parentCommentId, userId, comment });
};

export const fetchCommentsByContentId = async (contentId) => {
    return await getCommentsByContentId(contentId);
};

export const fetchCommentList = async (contentId, limit, offset, sortBy, sortDirection) => {
    return await getCommentList(contentId, limit, offset, sortBy, sortDirection);
};

export const fetchCommentReplies = async (commentId, limit, offset, sortBy, sortDirection) => {
    return await getCommentReplies(commentId, limit, offset, sortBy, sortDirection);
};

export const removeComment = async (id) => {
    await deleteCommentById(id);
};
