import pool from "../../configuration/dbConfiguration.js";
import {
    deleteOtherLenderRelations, insertOtherLender, updateFileUsage,
    updateLenderData,
    updateLenderDetail,
    validateLenderExists,
    validateParamExist
} from "../../repository/lenderRepository.js";


export const modifyLender = async (data, userEmail) => {
    const { id, lenderName, directLink, maxLoan, loanType, paymentType, maxTenor,
        additionalInformation, termsDocument, imageId, anotherLend, anotherLenderType } = data;

    if (!id || !lenderName || !directLink || !maxLoan || !loanType || !paymentType || !maxTenor || !imageId) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await validateLenderExists(client, id);
        await validateParamExist(client, loanType, 'LENDER_LOAN_TYPE');
        await validateParamExist(client, paymentType, 'LENDER_PAYMENT_TYPE');

        await updateLenderData(client, { id, lenderName, directLink, maxLoan, loanType, paymentType, maxTenor, imageId, userEmail });
        await updateLenderDetail(client, { id, additionalInformation, termsDocument });

        await deleteOtherLenderRelations(client, id);
        await insertOtherLender(client, id, anotherLend, 'ANOTHER');
        await insertOtherLender(client, id, anotherLenderType, 'ANOTHER_TYPE');

        await updateFileUsage(client, imageId);

        await client.query('COMMIT');
        return { id };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};