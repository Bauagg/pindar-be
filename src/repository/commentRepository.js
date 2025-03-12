import pool from "../configuration/dbConfiguration.js";

export const insertComment = async ({ contentId, parentCommentId, userId, comment }) => {
    const { rows } = await pool.query(
        `INSERT INTO comment (content_id, parent_comment_id, user_id, comment) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [contentId, parentCommentId, userId, comment]
    );
    return rows[0];
};

export const getCommentList = async (contentId, userId, limit, offset, sortBy, sortDirection) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.content_id, c.user_id, c.comment, c.created_date,
                COALESCE(cl.like_count, 0) AS likes_count,
                CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS user_liked
         FROM comment c
         LEFT JOIN (
             SELECT comment_id, COUNT(*) AS like_count
             FROM comment_like
             GROUP BY comment_id
         ) cl ON c.id = cl.comment_id
         LEFT JOIN (
             SELECT comment_id, user_id
             FROM comment_like
             WHERE user_id = $2
         ) ul ON c.id = ul.comment_id
         WHERE c.content_id = $1 AND c.parent_comment_id IS NULL
         ORDER BY ${sortBy} ${sortDirection}
         LIMIT $3 OFFSET $4`,
        [contentId, userId, limit, offset]
    );

    const totalResult = await pool.query(
        `SELECT COUNT(*) FROM comment WHERE content_id = $1 AND parent_comment_id IS NULL`,
        [contentId]
    );

    return {
        comments: rows,
        pagination: {
            total: parseInt(totalResult.rows[0].count, 10),
            totalPages: Math.ceil(totalResult.rows[0].count / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};


export const getCommentReplies = async (commentId, userId, limit, offset, sortBy, sortDirection) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.parent_comment_id, c.user_id, c.comment, c.created_date,
            COALESCE(cl.like_count, 0) AS likes_count,
            CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS user_liked
     FROM comment c
     LEFT JOIN (
         SELECT comment_id, COUNT(*) AS like_count
         FROM comment_like
         GROUP BY comment_id
     ) cl ON c.id = cl.comment_id
     LEFT JOIN (
         SELECT comment_id, user_id
         FROM comment_like
         WHERE user_id = $2
     ) ul ON c.id = ul.comment_id
     WHERE c.parent_comment_id = $1
     ORDER BY ${sortBy} ${sortDirection}
     LIMIT $3 OFFSET $4`,
        [commentId, userId, limit, offset]
    );

    const totalResult = await pool.query(
        `SELECT COUNT(*) FROM comment WHERE parent_comment_id = $1`,
        [commentId]
    );

    return {
        replies: rows,
        pagination: {
            total: parseInt(totalResult.rows[0].count, 10),
            totalPages: Math.ceil(totalResult.rows[0].count / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};


export const deleteCommentById = async (id) => {
    await pool.query(
        `DELETE FROM comment WHERE id = $1`,
        [id]
    );
};

export const getCommentsByContentId = async (contentId, userId, limit, offset, sortBy, sortDirection) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.content_id, c.parent_comment_id, c.user_id, c.comment, c.created_date,
            COALESCE(cl.like_count, 0) AS likes_count,
            CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS user_liked
     FROM comment c
     LEFT JOIN (
         SELECT comment_id, COUNT(*) AS like_count
         FROM comment_like
         GROUP BY comment_id
     ) cl ON c.id = cl.comment_id
     LEFT JOIN (
         SELECT comment_id, user_id
         FROM comment_like
         WHERE user_id = $2
     ) ul ON c.id = ul.comment_id
     WHERE c.content_id = $1
     ORDER BY ${sortBy} ${sortDirection}
     LIMIT $3 OFFSET $4`,
        [contentId, userId, limit, offset]
    );

    const totalResult = await pool.query(
        `SELECT COUNT(*) FROM comment WHERE content_id = $1`,
        [contentId]
    );

    return {
        comments: rows,
        pagination: {
            total: parseInt(totalResult.rows[0].count, 10),
            totalPages: Math.ceil(totalResult.rows[0].count / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};

export const deleteCommentLike = async (commentId, userId) => {
    const { rowCount } = await pool.query(
        `DELETE FROM comment_like WHERE comment_id = $1 AND user_id = $2`,
        [commentId, userId]
    );
    return rowCount;
};

export const insertCommentLike = async (commentId, userId) => {
    await pool.query(
        `INSERT INTO comment_like (comment_id, user_id) VALUES ($1, $2)`,
        [commentId, userId]
    );
};