import {softDeleteLender} from "../../repository/lenderRepository.js";
import pool from "../../configuration/dbConfiguration.js";

export const removeLender = async (lenderId, userEmail) => {
    if (!lenderId) {
        throw { status: 400, message: 'Lender ID is required' };
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await softDeleteLender(client, lenderId, userEmail);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};