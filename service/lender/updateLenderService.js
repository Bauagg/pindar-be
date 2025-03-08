import pool from "../../configuration/dbConfiguration.js";
import {
    checkLenderExists,
    deleteOtherLenders, insertOtherLender,
    updateFileUsage,
    updateLenderById,
    updateLenderDetailById
} from "../../repository/lenderRepository.js";

export const modifyLender = async (body, userEmail) => {
    const {
        id,
        lenderName,
        directLink,
        maxLoan,
        loanType,
        maxTenor,
        additionalInformation,
        termsDocument,
        anotherLend = [],
        anotherLenderType = [],
        imageId
    } = body;

    if (!id || !lenderName || !directLink || !maxLoan || !loanType || !additionalInformation || !termsDocument) {
        throw { status: 400, message: 'Required fields missing or invalid' };
    }

    if (loanType === 'with tenor' && (!maxTenor || maxTenor <= 0)) {
        throw { status: 400, message: 'Invalid maxTenor' };
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await updateLenderById(client, { id, lenderName, directLink, maxLoan, maxTenor, loanType, imageId, userEmail });
        await updateLenderDetailById(client, { id, additionalInformation, termsDocument });

        if (imageId) {
            await updateFileUsage(client, imageId);
        }

        await deleteOtherLenders(client, id);

        for (const relatedId of [...anotherLend, ...anotherLenderType]) {
            const exists = await checkLenderExists(client, relatedId);
            if (!exists) {
                throw { status: 400, message: `Invalid lender ID: ${relatedId}` };
            }
        }

        await insertOtherLender(client, id, anotherLend, 'ANOTHER');
        await insertOtherLender(client, id, anotherLenderType, 'ANOTHER_TYPE');

        await client.query('COMMIT');

        return { id };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};