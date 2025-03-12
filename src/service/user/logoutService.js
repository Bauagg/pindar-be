import pool from "../../configuration/dbConfiguration.js";


export const deleteRefreshTokenService = async (userId) => {
    const client = await pool.connect();
    try {
        await client.query("DELETE FROM refresh_tokens WHERE user_id = $1;", [userId]);
    } finally {
        client.release();
    }
};
