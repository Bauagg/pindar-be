import {
    checkFeatureExists,
    checkPublisherExists,
    deleteCreditCardById,
    getCreditCardById,
    getCreditCardList,
    insertCreditCard,
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

export const fetchCreditCardList = async (limit, offset, search) => {
    const creditCards = await getCreditCardList(limit, offset, search);
    return {
        creditCards: creditCards.creditCards.map(formatCreditCardResponse),
        pagination: {
            total: creditCards.pagination.total,
            totalPages: creditCards.pagination.totalPages,
            currentPage: creditCards.pagination.currentPage,
            size: creditCards.pagination.size
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

// ✅ Helper function to format response in camelCase
const formatCreditCardResponse = (creditCard) => ({
    id: creditCard.id,
    imageId: creditCard.image_id,
    publisherId: creditCard.publisher_id,
    featureTypeId: creditCard.feature_type_id,
    rewardOrFee: creditCard.reward_or_fee,
    detailRewardOrFee: creditCard.detail_reward_or_fee,
    title: creditCard.title,
    additionalCardAnnualFee: creditCard.additional_card_annual_fee,
    purchaseRate: creditCard.purchase_rate,
    cashbackRate: creditCard.cashback_rate,
    detailCashbackRate: creditCard.detail_cashback_rate,
    minimumWithdraw: creditCard.minimum_withdraw,
    monthlyIncomeMinimum: creditCard.monthly_income_minimum,
    whoCanRegister: creditCard.who_can_register,
    mustHaveCreditCard: creditCard.must_have_credit_card,
    cardImageId: creditCard.card_image_id,
    createdBy: creditCard.created_by,
    createdDate: creditCard.created_date,
    updatedBy: creditCard.updated_by,
    updatedDate: creditCard.updated_date
});
