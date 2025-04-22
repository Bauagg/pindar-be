import {
    addProductFaq,
    fetchProductFaqById, fetchProductFaqsByType,
    modifyProductFaq,
    removeProductFaq
} from "../service/faq/faqService.js";


export const createProductFaq = async (req, res, next) => {
    try {
        const faq = await addProductFaq(req.body);
        res.status(201).json({ code: 201, message: 'Product FAQ created successfully.', data: faq });
    } catch (err) {
        next(err);
    }
};

export const getProductFaqs = async (req, res, next) => {
    try {
        const { productType } = req.params;
        const {
            limit = 10,
            offset = 0,
            search = ""
        } = req.query;

        const faqs = await fetchProductFaqsByType(
            productType,
            parseInt(limit, 10),
            parseInt(offset, 10),
            search
        );

        res.status(200).json({
            code: 200,
            message: 'Product FAQs retrieved successfully.',
            data: faqs
        });
    } catch (err) {
        next(err);
    }
};


export const getProductFaqById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const faq = await fetchProductFaqById(id);
        res.status(200).json({ code: 200, message: 'Product FAQ retrieved successfully.', data: faq });
    } catch (err) {
        next(err);
    }
};

export const updateProductFaq = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedFaq = await modifyProductFaq(id, req.body);
        res.status(200).json({ code: 200, message: 'Product FAQ updated successfully.', data: updatedFaq });
    } catch (err) {
        next(err);
    }
};

export const deleteProductFaq = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removeProductFaq(id);
        res.status(200).json({ code: 200, message: 'Product FAQ deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
