import pool from "../configuration/dbConfiguration.js";


export const insertContent = async ({ title, categoryId, contentDetail, linkPath, imageId }) => {
    const { rows } = await pool.query(
        `INSERT INTO content (title, category_id, content_detail, link_path, image_id) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, categoryId, contentDetail, linkPath, imageId]
    );
    return rows[0];
};

export const insertBulkContent = async (contents) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const values = contents.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(",");
        const params = contents.flatMap(c => [c.title, c.categoryId, c.contentDetail, c.linkPath, c.imageId]);

        const { rows } = await client.query(
            `INSERT INTO content (title, category_id, content_detail, link_path, image_id) 
       VALUES ${values} RETURNING *`,
            params
        );

        await client.query('COMMIT');
        return rows;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getContentById = async (id) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.title, cc.name  AS category_name, cc.id as category_id, c.content_detail, c.link_path,
            CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS image_link
     FROM content c
     JOIN content_category cc ON c.category_id = cc.id
     LEFT JOIN files f ON c.image_id = f.id
     WHERE c.id = $1 AND c.is_deleted = FALSE`,
        [id]
    );
    return rows[0];
};

export const getContentList = async (limit, offset, sortBy, sortDirection) => {
    const validSortColumns = ["title", "category_name", "created_date"];
    if (!validSortColumns.includes(sortBy)) sortBy = "created_date";
    if (!["asc", "desc"].includes(sortDirection.toLowerCase())) sortDirection = "desc";

    const client = await pool.connect();
    try {
        const contentResult = await client.query(
            `SELECT c.id, c.title, cc.name AS category_name, c.link_path, c.created_date,
                CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id::TEXT, f.file_extension) ELSE NULL END AS image_link
            FROM content c
            JOIN content_category cc ON c.category_id = cc.id
            LEFT JOIN files f ON c.image_id = f.id
            WHERE c.is_deleted = FALSE
            ORDER BY ${sortBy} ${sortDirection}
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const totalResult = await client.query(
            `SELECT COUNT(*) FROM content WHERE is_deleted = FALSE`
        );

        return {
            contents: contentResult.rows,
            pagination: {
                total: parseInt(totalResult.rows[0].count, 10),
                totalPages: Math.ceil(totalResult.rows[0].count / limit),
                currentPage: Math.floor(offset / limit) + 1,
                size: limit // ✅ Now includes `size`
            }
        };
    } finally {
        client.release();
    }
};


export const updateContentById = async (id, { title, categoryId, contentDetail, linkPath, imageId }) => {
    const { rows } = await pool.query(
        `UPDATE content 
     SET title = $1, category_id = $2, content_detail = $3, link_path = $4, image_id = $5, updated_date = NOW()
     WHERE id = $6 RETURNING *`,
        [title, categoryId, contentDetail, linkPath, imageId, id]
    );
    return rows[0];
};

export const deleteContentById = async (id) => {
    await pool.query(`DELETE FROM content WHERE id = $1`, [id]);
};