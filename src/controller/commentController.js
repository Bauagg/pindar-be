import {
    addComment,
    fetchCommentList,
    fetchCommentReplies,
    fetchCommentsByContentId, removeComment
} from "../service/content/commentService.js";


export const createComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contentId } = req.params;
        const { parentCommentId, comment } = req.body;

        if (!comment) {
            throw { status: 400, message: 'Comment text is required.' };
        }

        const newComment = await addComment({ contentId, parentCommentId, userId, comment });

        res.status(201).json({ code: 201, message: 'Comment created successfully.', data: newComment });
    } catch (err) {
        next(err);
    }
};

export const getCommentsByContentId = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const comments = await fetchCommentsByContentId(contentId);

        res.status(200).json({ code: 200, message: 'Comments retrieved successfully.', data: comments });
    } catch (err) {
        next(err);
    }
};

export const getCommentList = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const { limit = 10, offset = 0, sortBy = 'created_date', sortDirection = 'desc' } = req.query;
        const comments = await fetchCommentList(contentId, parseInt(limit, 10), parseInt(offset, 10), sortBy, sortDirection);

        res.status(200).json({ code: 200, message: 'First-tier comments retrieved successfully.', data: comments });
    } catch (err) {
        next(err);
    }
};

export const getCommentReplies = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { limit = 10, offset = 0, sortBy = 'created_date', sortDirection = 'asc' } = req.query;
        const replies = await fetchCommentReplies(commentId, parseInt(limit, 10), parseInt(offset, 10), sortBy, sortDirection);

        res.status(200).json({ code: 200, message: 'Comment replies retrieved successfully.', data: replies });
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        await removeComment(id);
        res.status(200).json({ code: 200, message: 'Comment deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
