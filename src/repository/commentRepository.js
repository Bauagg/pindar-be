import pool from "../configuration/dbConfiguration.js";

export const insertComment = async ({ contentId, parentCommentId, userId, comment }) => {
    const { rows } = await pool.query(
        `INSERT INTO comment (content_id, parent_comment_id, user_id, comment) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [contentId, parentCommentId, userId, comment]
    );
    return rows[0];
};

export const getCommentList = async (contentId, limit, offset, sortBy, sortDirection) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.content_id, c.user_id, c.comment, c.created_date,
                COALESCE(cl.like_count, 0) AS likes_count
         FROM comment c
                  LEFT JOIN (
             SELECT comment_id, COUNT(*) AS like_count
             FROM comment_like
             GROUP BY comment_id
         ) cl ON c.id = cl.comment_id
         WHERE c.content_id = $1 AND c.parent_comment_id IS NULL
         ORDER BY ${sortBy} ${sortDirection}
     LIMIT $2 OFFSET $3`,
        [contentId, limit, offset]
    );

    return { comments: rows };
};

export const getCommentReplies = async (commentId, limit, offset, sortBy, sortDirection) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.parent_comment_id, c.user_id, c.comment, c.created_date,
                COALESCE(cl.like_count, 0) AS likes_count
         FROM comment c
                  LEFT JOIN (
             SELECT comment_id, COUNT(*) AS like_count
             FROM comment_like
             GROUP BY comment_id
         ) cl ON c.id = cl.comment_id
         WHERE c.parent_comment_id = $1
         ORDER BY ${sortBy} ${sortDirection}
     LIMIT $2 OFFSET $3`,
        [commentId, limit, offset]
    );

    return { replies: rows };
};

export const deleteCommentById = async (id) => {
    await pool.query(
        `DELETE FROM comment WHERE id = $1`,
        [id]
    );
};

export const getCommentsByContentId = async (contentId) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.content_id, c.parent_comment_id, c.user_id, c.comment, c.created_date,
                COALESCE(cl.like_count, 0) AS likes_count
         FROM comment c
                  LEFT JOIN (
             SELECT comment_id, COUNT(*) AS like_count
             FROM comment_like
             GROUP BY comment_id
         ) cl ON c.id = cl.comment_id
         WHERE c.content_id = $1
         ORDER BY c.created_date ASC`,
        [contentId]
    );
    return rows;
};