
import pool from "../../configuration/dbConfiguration.js";
import {
    insertLender,
    insertLenderDetail,
    insertOtherLender, updateFileUsage,
    validateParamExist
} from "../../repository/lenderRepository.js";

export const addLenderService = async (data, userEmail) => {
    const { lenderName, directLink, maxLoan, loanType, paymentType, maxTenor,
        additionalInformation, termsDocument, imageId, anotherLend, anotherLenderType } = data;

    if (!lenderName || !directLink || !maxLoan || !loanType || !paymentType || !maxTenor || !imageId) {
        throw { status: 400, message: 'Missing required fields.' };
    }


    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await validateParamExist(client, loanType, 'LENDER_LOAN_TYPE');
        await validateParamExist(client, paymentType, 'LENDER_PAYMENT_TYPE');

        const lenderId = await insertLender(client, { lenderName, directLink, maxLoan, loanType, paymentType, maxTenor, imageId, userEmail });
        await insertLenderDetail(client, { lenderId, additionalInformation, termsDocument });

        await insertOtherLender(client, lenderId, anotherLend, 'ANOTHER');
        await insertOtherLender(client, lenderId, anotherLenderType, 'ANOTHER_TYPE');

        await updateFileUsage(client, imageId);

        await client.query('COMMIT');
        return { id: lenderId };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};