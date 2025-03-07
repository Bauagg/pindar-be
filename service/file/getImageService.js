import pool from "../../configuration/dbConfiguration.js";

export const getFileById = async (fileId) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT file_extension, file_data 
            FROM files 
            WHERE id = $1;
        `;
        const { rows } = await client.query(query, [fileId]);

        return rows.length > 0 ? rows[0] : null;
    } finally {
        client.release();
    }
};
