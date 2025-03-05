const pool = require("../../configuration/dbConfiguration"); // ✅ Ensure correct import

const getAllUsers = async (limit, offset, search, sortBy, sortDirection) => {
    let query = `SELECT * FROM users`;
    let queryParams = [];

    // Text Search Filter
    if (search) {
        query += ` WHERE user_name ILIKE $1 
                   OR full_name ILIKE $1 
                   OR email ILIKE $1 
                   OR phone_number ILIKE $1`;
        queryParams.push(`%${search}%`);
    }

    // Sorting
    const validSortFields = ["user_name", "full_name", "email", "phone_number", "created_date"];
    const validSortDirections = ["ASC", "DESC"];

    if (sortBy && validSortFields.includes(sortBy)) {
        const direction = validSortDirections.includes(sortDirection?.toUpperCase()) ? sortDirection.toUpperCase() : "ASC";
        query += ` ORDER BY ${sortBy} ${direction}`;
    } else {
        query += ` ORDER BY created_date DESC`; // Default sorting
    }

    // Pagination
    queryParams.push(limit, offset);
    query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    const result = await pool.query(query, queryParams);
    return result.rows;
};

const getUserCount = async (search) => {
    let query = `SELECT COUNT(*) FROM users`;
    let queryParams = [];

    if (search) {
        query += ` WHERE user_name ILIKE $1 
                   OR full_name ILIKE $1 
                   OR email ILIKE $1 
                   OR phone_number ILIKE $1`;
        queryParams.push(`%${search}%`);
    }

    const result = await pool.query(query, queryParams);
    return parseInt(result.rows[0].count);
};

module.exports = {
    getAllUsers,
    getUserCount,
};

