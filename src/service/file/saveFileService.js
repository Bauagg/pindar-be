import pool from "../../configuration/dbConfiguration.js";


export const saveFileService = async ({ fileName, fileExtension, fileSize, fileData, moduleName, uploadedBy }) => {
    const client = await pool.connect();

    try {
        const query = `
            INSERT INTO files (file_name, file_extension, file_size, file_data, is_used, module_name, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;

        const values = [fileName, fileExtension, fileSize, fileData, false, moduleName, uploadedBy];

        const result = await client.query(query, values);
        return result.rows[0].id; // Return the file ID
    } finally {
        client.release();
    }
};
