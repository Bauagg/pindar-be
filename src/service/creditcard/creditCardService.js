import {
    checkFeatureExists,
    checkPublisherExists,
    deleteCreditCardById, fetchCreditCardFeatures,
    getCreditCardById, getCreditCards,
    insertCreditCard, searchCreditCards,
    updateCreditCardById
} from "../../repository/creditCardRepository.js";
import pool from "../../configuration/dbConfiguration.js";

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

    const { data, total } = await searchCreditCards({
        publisherId,
        featureIds,
        minYearlyFee,
        maxYearlyFee,
        minYearlyIncome,
        maxYearlyIncome,
        sortBy,
        sortDirection,
        limit,
        offset
    });

    const cardIds = data.map(card => card.id);
    const featuresMap = await fetchCreditCardFeatures(cardIds);

    const formatted = data.map(card => ({
        ...formatCreditCardResponse(card),
        features: featuresMap[card.id] || []
    }));

    return {
        creditCards: formatted,
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
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

// ✅ Helper function to format response in camelCase
const formatCreditCardResponse = (creditCard) => ({
    id: creditCard.id,
    title: creditCard.title,
    yearlyFee: creditCard.yearly_fee,
    additionalCardAnnualFee: creditCard.additional_card_annual_fee,
    purchaseRate: creditCard.purchase_rate,
    cashbackRate: creditCard.cashback_rate,
    monthlyIncomeMinimum: creditCard.monthly_income_minimum,
    yearlyIncomeMinimum: creditCard.yearly_income_minimum,
    monthlyMinimumPayment: creditCard.monthly_minimum_payment,
    latePaymentChargePenalty: creditCard.late_payment_charge_penalty,
    latePaymentAdminCharge: creditCard.late_payment_admin_charge,
    maximumWithdrawDaily: creditCard.maximum_withdraw_daily,
    mainCardMinimumAge: creditCard.main_card_minimum_age,
    mainCardMaximumAge: creditCard.main_card_maximum_age,
    additionalCardMinimumAge: creditCard.additional_card_minimum_age,
    detailInformation: creditCard.detail_information,
    termsDocument: creditCard.terms_document,
    billPaymentTutorial: creditCard.bill_payment_tutorial,
    basicInfo: creditCard.basic_info,
    mainFeature: creditCard.main_feature,
    allFacilities: creditCard.all_facilities,
    feeAndCharges: creditCard.fee_and_charges,
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


