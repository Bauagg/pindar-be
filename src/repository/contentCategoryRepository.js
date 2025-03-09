import pool from "../configuration/dbConfiguration.js";


export const insertContentCategory = async ({ name }) => {
    const { rows } = await pool.query(
        `INSERT INTO content_category (name) 
     VALUES ($1) RETURNING *`,
        [name]
    );
    return rows[0];
};

export const getAllContentCategories = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM content_category WHERE is_deleted = FALSE ORDER BY name ASC`
    );
    return rows;
};

export const getContentCategoryById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM content_category WHERE id = $1 AND is_deleted = FALSE`,
        [id]
    );
    return rows[0];
};

export const updateContentCategoryById = async (id, { name }) => {
    const { rows } = await pool.query(
        `UPDATE content_category 
     SET name = $1
     WHERE id = $2 RETURNING *`,
        [name, id]
    );
    return rows[0];
};

export const deleteContentCategoryById = async (id) => {
    await pool.query(`DELETE FROM content_category WHERE id = $1`, [id]);
};

export const insertBulkContentCategories = async (categories) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const values = categories.map((c, index) => `($${index + 1})`).join(",");
        const params = categories.map(c => c.name);

        const { rows } = await client.query(
            `INSERT INTO content_category (name) 
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