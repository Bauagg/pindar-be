export const getValidRoles = async (roles, client) => {
    const query = `SELECT id, name FROM role WHERE name = ANY($1);`;
    const { rows } = await client.query(query, [roles]);
    return rows.map(row => row.name);
};

export const updateUserRoles = async (userId, roles, client) => {
    await client.query(`DELETE FROM user_role WHERE user_id = $1;`, [userId]);

    const values = roles.map(role => `('${userId}', (SELECT id FROM role WHERE name = '${role}'))`).join(", ");
    const query = `INSERT INTO user_role (user_id, role_id) VALUES ${values};`;
    await client.query(query);
};
