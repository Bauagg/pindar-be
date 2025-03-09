import {
    deleteCommentById, deleteCommentLike,
    getCommentList,
    getCommentReplies,
    getCommentsByContentId,
    insertComment, insertCommentLike
} from "../../repository/commentRepository.js";



export const addComment = async ({ contentId, parentCommentId, userId, comment }) => {
    if (!contentId || !userId) {
        throw { status: 400, message: 'Missing required fields: contentId, userId.' };
    }
    return await insertComment({ contentId, parentCommentId, userId, comment });
};

export const fetchCommentsByContentId = async (contentId, userId, limit, offset, sortBy, sortDirection) => {
    return await getCommentsByContentId(contentId, userId, limit, offset, sortBy, sortDirection);
};

export const fetchCommentReplies = async (commentId, userId, limit, offset, sortBy, sortDirection) => {
    return await getCommentReplies(commentId, userId, limit, offset, sortBy, sortDirection);
};

export const fetchCommentList = async (contentId, userId, limit, offset, sortBy, sortDirection) => {
    return await getCommentList(contentId, userId, limit, offset, sortBy, sortDirection);
};

export const removeComment = async (id) => {
    await deleteCommentById(id);
};

export const toggleCommentLike = async (commentId, userId) => {
    const deleted = await deleteCommentLike(commentId, userId);

    if (deleted === 0) {
        await insertCommentLike(commentId, userId);
        return { liked: true };
    }

    return { liked: false };
};