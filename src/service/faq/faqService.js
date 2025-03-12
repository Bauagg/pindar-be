import {
    deleteProductFaqById,
    getProductFaqById, getProductFaqsByType,
    insertProductFaq,
    updateProductFaqById
} from "../../repository/faqRepository.js";


export const addProductFaq = async (data) => {
    const { productType, informationTitle, detailInformation, orderNumber = 1 } = data;

    if (!productType || !informationTitle || !detailInformation) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    return await insertProductFaq({ productType, informationTitle, detailInformation, orderNumber });
};

export const fetchProductFaqsByType = async (productType) => {
    return await getProductFaqsByType(productType);
};

export const fetchProductFaqById = async (id) => {
    const faq = await getProductFaqById(id);
    if (!faq) throw { status: 404, message: 'Product FAQ not found.' };
    return faq;
};

export const modifyProductFaq = async (id, data) => {
    const { productType, informationTitle, detailInformation, orderNumber } = data;
    if (!productType || !informationTitle || !detailInformation) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    return await updateProductFaqById(id, { productType, informationTitle, detailInformation, orderNumber });
};

export const removeProductFaq = async (id) => {
    await deleteProductFaqById(id);
};
