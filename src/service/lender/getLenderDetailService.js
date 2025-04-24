import {findLenderById, findLenderRelationsByType} from "../../repository/lenderRepository.js";
import pool from "../../configuration/dbConfiguration.js";

export const getLenderDetailById = async (lenderId) => {
    const lender = await findLenderById(lenderId);
    if (!lender) {
        throw { status: 404, message: 'Lender not found.' };
    }

    const another = await findLenderRelationsByType(lenderId, 'ANOTHER');
    const anotherType = await findLenderRelationsByType(lenderId, 'ANOTHER_TYPE');

    return {
        lenderName: lender.lender_name,
        directLink: lender.direct_link,
        maxLoan: lender.max_loan,
        maxTenor: lender.max_tenor,
        loanType: lender.type_loan_total,
        loanTypeId: lender.type_loan_total_id,
        paymentType: lender.payment_type_name,
        paymentTypeId: lender.payment_type_id,
        additionalInformation: lender.additional_information,
        termsDocument: lender.terms_document,
        imageLink: lender.image_link,
        basicInfo: lender.basic_info,
        plusValue: lender.plus_value,
        applymentTutorial: lender.applyment_tutorial,
        otherLenders: {
            another,
            anotherType,
        },
    };
};

export const recordProductAccess = async (productType, productId, userId, req) => {
    const client = await pool.connect();
    try {
        // Get IP address and user agent from request
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const query = `
            INSERT INTO product_access (product_type, product_id, user_id, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

        await client.query(query, [productType, productId, userId, ipAddress, userAgent]);
    } finally {
        client.release();
    }
};