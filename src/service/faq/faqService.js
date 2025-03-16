import {
    deleteProductFaqById,
    getProductFaqById,
    getProductFaqsByType,
    insertProductFaq,
    updateProductFaqById
} from "../../repository/faqRepository.js";

export const addProductFaq = async (data) => {
    const { productType, informationTitle, detailInformation, orderNumber = 1 } = data;

    if (!productType || !informationTitle || !detailInformation) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    const faq = await insertProductFaq({ productType, informationTitle, detailInformation, orderNumber });

    return formatFaqResponse(faq);
};

export const fetchProductFaqsByType = async (productType) => {
    const faqs = await getProductFaqsByType(productType);
    return faqs.map(formatFaqResponse);
};

export const fetchProductFaqById = async (id) => {
    const faq = await getProductFaqById(id);
    if (!faq) throw { status: 404, message: 'Product FAQ not found.' };
    return formatFaqResponse(faq);
};

export const modifyProductFaq = async (id, data) => {
    const { productType, informationTitle, detailInformation, orderNumber } = data;
    if (!productType || !informationTitle || !detailInformation) {
        throw { status: 400, message: 'Missing required fields.' };
    }

    const updatedFaq = await updateProductFaqById(id, { productType, informationTitle, detailInformation, orderNumber });

    return formatFaqResponse(updatedFaq);
};

export const removeProductFaq = async (id) => {
    await deleteProductFaqById(id);
};

// ✅ Helper function to format response in camelCase
const formatFaqResponse = (faq) => ({
    id: faq.id,
    productType: faq.product_type,
    informationTitle: faq.information_title,
    detailInformation: faq.detail_information,
    orderNumber: faq.order_number
});
