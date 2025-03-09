import pool from "../configuration/dbConfiguration.js";

export const insertCardFeature = async ({ featureName }) => {
    const { rows } = await pool.query(
        `INSERT INTO card_feature (feature_name) 
     VALUES ($1) RETURNING *`,
        [featureName]
    );
    return rows[0];
};

export const getAllCardFeatures = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM card_feature WHERE is_deleted = FALSE ORDER BY feature_name ASC`
    );
    return rows;
};

export const getCardFeatureById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM card_feature WHERE id = $1 AND is_deleted = FALSE`,
        [id]
    );
    return rows[0];
};

export const updateCardFeatureById = async (id, { featureName }) => {
    const { rows } = await pool.query(
        `UPDATE card_feature 
     SET feature_name = $1
     WHERE id = $2 RETURNING *`,
        [featureName, id]
    );
    return rows[0];
};

export const deleteCardFeatureById = async (id) => {
    await pool.query(`DELETE FROM card_feature WHERE id = $1`, [id]);
};

export const insertBulkCardFeatures = async (features) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const values = features.map((f, index) => `($${index + 1})`).join(",");
        const params = features.map(f => f.featureName);

        const { rows } = await client.query(
            `INSERT INTO card_feature (feature_name) 
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