import {addLenderTransaction} from "../../repository/lenderRepository.js";

export const createLender = async (body, userEmail) => {
    const {
        lenderName,
        directLink,
        maxLoan,
        loanType,
        maxTenor,
        additionalInformation,
        termsDocument,
        anotherLend,
        anotherLenderType,
        imageId
    } = body;

    if (!lenderName || !directLink || !maxLoan || !loanType || !additionalInformation || !termsDocument || !imageId) {
        throw { status: 400, message: 'Required fields missing or invalid' };
    }

    if (loanType === 'with tenor' && (!maxTenor || maxTenor <= 0)) {
        throw { status: 400, message: 'Invalid maxTenor' };
    }

    return await addLenderTransaction({
        lenderName,
        directLink,
        maxLoan,
        loanType,
        maxTenor: maxTenor || 0,
        additionalInformation,
        termsDocument,
        anotherLend: anotherLend || [],
        anotherLenderType: anotherLenderType || [],
        imageId,
        userEmail
    });
};