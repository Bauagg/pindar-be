import pool from "../../configuration/dbConfiguration.js";


export const createUser = async (fullName, email, phoneNumber, hashedPassword) => {
    const client = await pool.connect();
    try {
        const userQuery = `
            INSERT INTO users (full_name, email, phone_number, password, status, created_date, updated_date)
            VALUES ($1, $2, $3, $4, 'NEW', NOW(), NOW()) RETURNING id;
        `;
        const { rows } = await client.query(userQuery, [fullName, email, phoneNumber, hashedPassword]);

        const userId = rows[0].id;

        await client.query(
            `INSERT INTO user_role (user_id, role_id) 
             VALUES ($1, (SELECT id FROM role WHERE name = 'CUSTOMER'))`,
            [userId]
        );

        return userId;
    } finally {
        client.release();
    }
};

export const getUserByEmail = async (email, client) => {
    const query = `
        SELECT id, status, is_deleted FROM users WHERE email = $1;
    `;
    const { rows } = await client.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};
