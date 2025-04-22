import pool from "../configuration/dbConfiguration.js";

export const insertCardFeature = async ({ featureName }) => {
    const { rows } = await pool.query(
        `INSERT INTO card_feature (feature_name) 
     VALUES ($1) RETURNING *`,
        [featureName]
    );
    return rows[0];
};

export const getAllCardFeatures = async (limit, offset, search = "") => {
    const queryParams = [];
    let paramIndex = 1;

    let baseQuery = `
        SELECT * FROM card_feature
        WHERE is_deleted = FALSE
    `;
    let countQuery = `
        SELECT COUNT(*) FROM card_feature
        WHERE is_deleted = FALSE
    `;

    if (search.trim() !== "") {
        baseQuery += ` AND feature_name ILIKE $${paramIndex}`;
        countQuery += ` AND feature_name ILIKE $${paramIndex}`;
        queryParams.push(`%${search}%`);
        paramIndex++;
    }

    baseQuery += ` ORDER BY feature_name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const client = await pool.connect();
    try {
        const dataResult = await client.query(baseQuery, queryParams);
        const countResult = await client.query(countQuery, queryParams.slice(0, paramIndex - 1));

        return {
            features: dataResult.rows,
            pagination: {
                total: parseInt(countResult.rows[0].count, 10),
                totalPages: Math.ceil(countResult.rows[0].count / limit),
                currentPage: Math.floor(offset / limit) + 1,
                size: limit
            }
        };
    } finally {
        client.release();
    }
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