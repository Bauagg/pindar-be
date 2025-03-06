import pool from "../configuration/dbConfiguration.js";


export const userRepository = async (fullName, email, phoneNumber, hashedPassword) => {
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

export const getUserAndRoleByEmail = async (email, client) => {
    const query = `
        SELECT u.id, u.email, u.password, u.status, 
               ARRAY_AGG(r.name) AS roles
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.email = $1
        GROUP BY u.id;
    `;
    const { rows } = await client.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};

export const updateLastLogin = async (userId, client) => {
    const query = `UPDATE users SET last_login = NOW() WHERE id = $1;`;
    await client.query(query, [userId]);
};

export const insertUser = async (full_name, phone_number, email, hashedPassword, client) => {
    const query = `
        INSERT INTO users (full_name, phone_number, email, password, status, is_deleted)
        VALUES ($1, $2, $3, $4, 'ACTIVE', FALSE) RETURNING id;
    `;
    const { rows } = await client.query(query, [full_name, phone_number, email, hashedPassword]);
    return rows[0].id;
};

export const reactivateUser = async (userId, client) => {
    const query = `
        UPDATE users 
        SET is_deleted = FALSE, status = 'ACTIVE' 
        WHERE id = $1;
    `;
    await client.query(query, [userId]);
};

export const updateUserData = async (full_name, email, status, client) => {
    const query = `
        UPDATE users 
        SET full_name = $1, status = $2, updated_date = NOW()
        WHERE email = $3;
    `;
    await client.query(query, [full_name, status, email]);
};

export const softDeleteUser = async (email, client) => {
    const query = `
        UPDATE users 
        SET is_deleted = TRUE, status = 'INACTIVE', updated_date = NOW()
        WHERE email = $1;
    `;
    await client.query(query, [email]);
};

export const getAdminUsers = async (limit, offset, search, sortBy, sortOrder, client) => {
    const query = `
        SELECT u.id, u.full_name AS "fullName", u.email, u.status, u.is_deleted AS "isDeleted", 
               ARRAY_AGG(r.name) AS roles
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.is_deleted = FALSE
          AND r.name NOT IN ('CUSTOMER')
          AND (u.full_name ILIKE $1 OR u.email ILIKE $1)
        GROUP BY u.id
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $2 OFFSET $3;
    `;

    const { rows } = await client.query(query, [`%${search}%`, limit, offset]);
    return rows;
};

export const getTotalAdminUsers = async (search, client) => {
    const query = `
        SELECT COUNT(DISTINCT u.id) AS total
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.is_deleted = FALSE
          AND r.name NOT IN ('CUSTOMER')
          AND (u.full_name ILIKE $1 OR u.email ILIKE $1);
    `;

    const { rows } = await client.query(query, [`%${search}%`]);
    return rows[0].total;
};

export const getUserById = async (id, client) => {
    const query = `
        SELECT u.id, u.full_name AS "fullName", u.email, u.status, u.is_deleted AS "isDeleted", 
               ARRAY_AGG(r.name) AS roles
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.id = $1
        GROUP BY u.id;
    `;

    const { rows } = await client.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
};

export const getCustomers = async (limit, offset, search, sortBy, sortOrder, client) => {
    const query = `
        SELECT u.id, u.full_name AS "fullName", u.email, u.status, u.is_deleted AS "isDeleted", 
               ARRAY_AGG(r.name) AS roles
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.is_deleted = FALSE
          AND r.name = 'CUSTOMER'
          AND (u.full_name ILIKE $1 OR u.email ILIKE $1)
        GROUP BY u.id
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $2 OFFSET $3;
    `;

    const { rows } = await client.query(query, [`%${search}%`, limit, offset]);
    return rows;
};

export const getTotalCustomers = async (search, client) => {
    const query = `
        SELECT COUNT(DISTINCT u.id) AS total
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.is_deleted = FALSE
          AND r.name = 'CUSTOMER'
          AND (u.full_name ILIKE $1 OR u.email ILIKE $1);
    `;

    const { rows } = await client.query(query, [`%${search}%`]);
    return rows[0].total;
};

export const getCustomerById = async (id, client) => {
    const query = `
        SELECT u.id, u.full_name AS "fullName", u.email, u.status, u.is_deleted AS "isDeleted"
        FROM users u
        LEFT JOIN user_role ur ON u.id = ur.user_id
        LEFT JOIN role r ON ur.role_id = r.id
        WHERE u.id = $1 AND r.name = 'CUSTOMER';
    `;

    const { rows } = await client.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
};

export const updateCustomerStatusInDB = async (id, status, client) => {
    const query = `
        UPDATE users 
        SET status = $1, updated_date = NOW()
        WHERE id = $2;
    `;
    await client.query(query, [status, id]);
};
