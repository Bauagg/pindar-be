import pool from "../configuration/dbConfiguration.js";


export const createAnnouncement = async ({ status, url, imageId, order }) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { rows } = await client.query(
            `INSERT INTO announcement (status, url, image, "order")
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [status, url, imageId, order]
        );

        if (imageId) {
            await client.query(`UPDATE files SET is_used = TRUE WHERE id = $1`, [imageId]);
        }

        await client.query("COMMIT");
        return rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const getAnnouncementById = async (id) => {
    const { rows } = await pool.query(
        `SELECT a.id, a.status, a.url, a.order,
                CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, '.', f.file_extension) ELSE NULL END AS image_link
         FROM announcement a
         LEFT JOIN files f ON a.image = f.id
         WHERE a.id = $1 AND a.is_deleted = FALSE`,
        [id]
    );
    return rows[0];
};

export const getPaginatedAnnouncements = async (limit, offset) => {
    const { rows } = await pool.query(
        `SELECT a.id, a.status, a.url, a.order,
                CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, '.', f.file_extension) ELSE NULL END AS image_link
         FROM announcement a
         LEFT JOIN files f ON a.image = f.id
         WHERE a.is_deleted = FALSE
         ORDER BY a.order ASC, a.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return rows;
};

export const countAnnouncements = async () => {
    const { rows } = await pool.query(
        `SELECT COUNT(*) FROM announcement WHERE is_deleted = FALSE`
    );
    return parseInt(rows[0].count, 10);
};

export const updateAnnouncementById = async (id, { status, url, imageId, order }) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { rows: currentRows } = await client.query(
            `SELECT image FROM announcement WHERE id = $1 AND is_deleted = FALSE`,
            [id]
        );

        const previousImageId = currentRows[0]?.image;

        const { rows } = await client.query(
            `UPDATE announcement
             SET status = $1, url = $2, image = $3, "order" = $4
             WHERE id = $5 AND is_deleted = FALSE
             RETURNING *`,
            [status, url, imageId, order, id]
        );

        if (imageId) {
            await client.query(`UPDATE files SET is_used = TRUE WHERE id = $1`, [imageId]);
        }

        if (previousImageId && previousImageId !== imageId) {
            await client.query(`UPDATE files SET is_used = FALSE WHERE id = $1`, [previousImageId]);
        }

        await client.query("COMMIT");
        return rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const deleteAnnouncementById = async (id) => {
    await pool.query(
        `UPDATE announcement
         SET is_deleted = TRUE
         WHERE id = $1`,
        [id]
    );
};

export const getActiveAnnouncements = async () => {
    const { rows } = await pool.query(
        `SELECT a.id, a.status, a.url, a.order,
                CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS image_link
         FROM announcement a
         LEFT JOIN files f ON a.image = f.id
         WHERE a.is_deleted = FALSE AND a.status = 'Active'
         ORDER BY a.order ASC`
    );
    return rows;
};