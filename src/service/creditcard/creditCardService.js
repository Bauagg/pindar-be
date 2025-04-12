import {
    checkFeatureExists,
    checkPublisherExists,
    deleteCreditCardById,
    getCreditCardById, getCreditCards,
    insertCreditCard, searchCreditCards,
    updateCreditCardById
} from "../../repository/creditCardRepository.js";

export const addCreditCard = async (data) => {
    const publisherExists = await checkPublisherExists(data.publisherId);
    if (!publisherExists) {
        throw { status: 400, message: 'Invalid publisherId. Publisher does not exist.' };
    }

    const featureExists = await checkFeatureExists(data.featureTypeId);
    if (!featureExists) {
        throw { status: 400, message: 'Invalid featureTypeId. Feature does not exist.' };
    }

    const creditCard = await insertCreditCard(data);

    return formatCreditCardResponse(creditCard);
};

export const fetchCreditCardById = async (id) => {
    const creditCard = await getCreditCardById(id);
    if (!creditCard) throw { status: 404, message: 'Credit card not found.' };

    return formatCreditCardResponse(creditCard);
};

export const fetchCreditCardsList = async (filters) => {
    const {
        publisherId,
        featureIds = [],
        minYearlyFee,
        maxYearlyFee,
        minYearlyIncome,
        maxYearlyIncome,
        sortBy = "yearly_fee",
        sortDirection = "asc",
        limit = 10,
        offset = 0
    } = filters;

    if (!["yearly_fee", "yearly_income_minimum"].includes(sortBy)) {
        throw { status: 400, message: "Invalid sort field." };
    }

    if (!["asc", "desc"].includes(sortDirection.toLowerCase())) {
        throw { status: 400, message: "Invalid sort direction." };
    }

    const creditCards = await searchCreditCards({
        publisherId,
        featureIds,
        minYearlyFee,
        maxYearlyFee,
        minYearlyIncome,
        maxYearlyIncome,
        sortBy,
        sortDirection,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10)
    });

    return creditCards.map(formatCreditCardResponse);
};

export const modifyCreditCard = async (id, data) => {
    const publisherExists = await checkPublisherExists(data.publisherId);
    if (!publisherExists) {
        throw { status: 400, message: 'Invalid publisherId. Publisher does not exist.' };
    }

    const featureExists = await checkFeatureExists(data.featureTypeId);
    if (!featureExists) {
        throw { status: 400, message: 'Invalid featureTypeId. Feature does not exist.' };
    }

    const updatedCreditCard = await updateCreditCardById(id, data);

    return formatCreditCardResponse(updatedCreditCard);
};

export const removeCreditCard = async (id) => {
    await deleteCreditCardById(id);
};
export const fetchCreditCards = async (filters) => {
    return await getCreditCards(filters);
}

// ✅ Helper function to format response in camelCase
const formatCreditCardResponse = (creditCard) => ({
    id: creditCard.id,
    title: creditCard.title,
    yearlyFee: creditCard.yearly_fee,
    additionalCardAnnualFee: creditCard.additional_card_annual_fee,
    detailYearlyFee: creditCard.detail_yearly_fee,
    purchaseRate: creditCard.purchase_rate,
    cashbackRate: creditCard.cashback_rate,
    monthlyIncomeMinimum: creditCard.monthly_income_minimum,
    yearlyIncomeMinimum: creditCard.yearly_income_minimum,
    additionalInformation: creditCard.additional_information,
    termsDocument: creditCard.terms_document,
    productDescription: creditCard.product_description,
    billPaymentTutorial: creditCard.bill_payment_tutorial,
    publisher: {
        id: creditCard.publisher_id,
        name: creditCard.publisher_name
    },
    type: {
        id: creditCard.type_id,
        name: creditCard.type_name
    },
    imageLink: creditCard.image_link,
    features: creditCard.features
});
