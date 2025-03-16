import {
    deleteCommentById,
    deleteCommentLike,
    getCommentList,
    getCommentReplies,
    getCommentsByContentId,
    insertComment,
    insertCommentLike
} from "../../repository/commentRepository.js";

export const addComment = async ({ contentId, parentCommentId, userId, comment }) => {
    if (!contentId || !userId) {
        throw { status: 400, message: 'Missing required fields: contentId, userId.' };
    }

    const newComment = await insertComment({ contentId, parentCommentId, userId, comment });

    return formatCommentResponse(newComment);
};

export const fetchCommentsByContentId = async (contentId, userId, limit, offset, sortBy, sortDirection) => {
    const comments = await getCommentsByContentId(contentId, userId, limit, offset, sortBy, sortDirection);

    return {
        comments: comments.comments.map(formatCommentResponse),
        pagination: {
            total: comments.pagination.total,
            totalPages: comments.pagination.totalPages,
            currentPage: comments.pagination.currentPage,
            size: comments.pagination.size
        }
    };
};

export const fetchCommentReplies = async (commentId, userId, limit, offset, sortBy, sortDirection) => {
    const replies = await getCommentReplies(commentId, userId, limit, offset, sortBy, sortDirection);

    return {
        replies: replies.replies.map(formatCommentResponse),
        pagination: {
            total: replies.pagination.total,
            totalPages: replies.pagination.totalPages,
            currentPage: replies.pagination.currentPage,
            size: replies.pagination.size
        }
    };
};

export const fetchCommentList = async (contentId, userId, limit, offset, sortBy, sortDirection) => {
    const comments = await getCommentList(contentId, userId, limit, offset, sortBy, sortDirection);

    return {
        comments: comments.comments.map(formatCommentResponse),
        pagination: {
            total: comments.pagination.total,
            totalPages: comments.pagination.totalPages,
            currentPage: comments.pagination.currentPage,
            size: comments.pagination.size
        }
    };
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

// ✅ Helper function to format response in camelCase
const formatCommentResponse = (comment) => ({
    id: comment.id,
    contentId: comment.content_id,
    parentCommentId: comment.parent_comment_id,
    userId: comment.user_id,
    comment: comment.comment,
    createdDate: comment.created_date,
    likesCount: comment.likes_count,
    userLiked: comment.user_liked
});
