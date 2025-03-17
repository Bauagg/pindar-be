import pool from "../configuration/dbConfiguration.js";


export const getTokenExpiration = async (paramKey, client) => {
    const query = `SELECT param_value FROM parameters WHERE param_key = $1;`;
    const { rows } = await client.query(query, [paramKey]);
    return rows.length > 0 ? parseInt(rows[0].param_value, 10) : null;
};

export const getParameter = async (paramKey, client) => {
    const query = `SELECT param_value FROM parameters WHERE param_key = $1;`;
    const { rows } = await client.query(query, [paramKey]);
    return rows.length > 0 ? rows[0].param_value : null;
};

export const getParametersByGroup = async (group) => {
    const query = `
        SELECT param_key AS name, param_value AS value
        FROM parameters
        WHERE LOWER(param_group) LIKE LOWER($1) || '%'
          AND is_fetchable = TRUE
        ORDER BY param_key ASC
    `;

    const { rows } = await pool.query(query, [group]);
    return rows;
};

export const updateParameterValue = async (paramKey, paramValue) => {
    const { rows } = await pool.query(
        `UPDATE parameters 
         SET param_value = $1, updated_at = NOW()
         WHERE param_key = $2
         RETURNING id, param_key, param_value, updated_at`,
        [paramValue, paramKey]
    );

    return rows[0];
};

export const getParameterByKey = async (paramKey) => {
    const { rows } = await pool.query(
        `SELECT param_key, param_value
         FROM parameters
         WHERE param_key = $1 AND is_fetchable = TRUE`,
        [paramKey]
    );

    return rows[0]; // Returns undefined if not found
};