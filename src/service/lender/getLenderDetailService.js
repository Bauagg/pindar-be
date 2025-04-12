import {findLenderById, findLenderRelationsByType} from "../../repository/lenderRepository.js";

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
        otherLenders: {
            another,
            anotherType,
        },
    };
};