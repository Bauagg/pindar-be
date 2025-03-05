

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