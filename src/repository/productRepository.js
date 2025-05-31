import pool from "../configuration/dbConfiguration.js";

export const fetchSearchProducts = async (search) => {
    const client = await pool.connect();

    try {
        let paramIndex = 1;
        const queryParams = [];
        let filterConditions = '1=1';

        if (search) {
            filterConditions += ` AND LOWER(si.title) LIKE LOWER($${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        const result = await client.query(
            `SELECT si.ref_id AS id,
                    si.title,
                    si.type,
                    CONCAT('/api/file/image/', f.id, f.file_extension) AS imageLink,
                    si.direct_link AS directLink
             FROM search_index si
             LEFT JOIN files f ON si.image_id = f.id
             WHERE ${filterConditions}
             ORDER BY si.title ASC
             LIMIT 5`,
            queryParams
        );

        return result.rows;
    } finally {
        client.release();
    }
};
