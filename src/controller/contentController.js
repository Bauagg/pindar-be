import {
    addContent,
    fetchContentById,
    fetchContentList, fetchTrendingContent,
    modifyContent,
    removeContent
} from "../service/content/contentService.js";
import {recordContentView} from "../repository/contentRepository.js";
import {getTrendingProducts} from "../repository/trendingRepository.js";


export const createContent = async (req, res, next) => {
    try {
        const content = await addContent(req.body);
        res.status(201).json({ code: 201, message: 'Content created successfully.', data: content });
    } catch (err) {
        next(err);
    }
};

export const bulkCreateContent = async (req, res, next) => {
    try {
        const contents = await addBulkContent(req.body);
        res.status(201).json({ code: 201, message: 'Contents created successfully.', data: contents });
    } catch (err) {
        next(err);
    }
};

export const getContentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const content = await fetchContentById(id);

        // Get user ID from JWT token if available
        let userId = null;
        if (req.user) {
            userId = req.user.id;
        }

        recordContentView(id, userId, req).catch(error => {
            console.error('Failed to record content view:', error);
        });

        res.status(200).json({ code: 200, message: 'Content retrieved successfully.', data: content });
    } catch (err) {
        next(err);
    }
};

export const getContentList = async (req, res, next) => {
    try {
        const {
            limit = 10,
            offset = 0,
            sortBy = 'created_date',
            sortDirection = 'desc',
            categoryId = null,
            search = '',
            requestType = 'regular',
            lastCount = 7
        } = req.query;

        let contentList;

        if (requestType === 'trending') {
            contentList = await fetchTrendingContent(
                parseInt(limit, 10),
                parseInt(offset, 10),
                parseInt(lastCount, 10),
                categoryId
            );
        } else {
            contentList = await fetchContentList(
                parseInt(limit, 10),
                parseInt(offset, 10),
                search,
                sortBy,
                sortDirection,
                categoryId
            );
        }

        res.status(200).json({
            code: 200,
            message: 'Content list retrieved successfully.',
            data: contentList
        });
    } catch (err) {
        next(err);
    }
};


export const updateContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedContent = await modifyContent(id, req.body);
        res.status(200).json({ code: 200, message: 'Content updated successfully.', data: updatedContent });
    } catch (err) {
        next(err);
    }
};

export const deleteContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removeContent(id);
        res.status(200).json({ code: 200, message: 'Content deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

export const getTrendingProductsController = async (req, res, next) => {
    try {
        const {
            productType = null,
            limit = 10,
            offset = 0,
            lastCount = 7
        } = req.query;

        // Validate productType if provided
        if (productType && !['lender', 'credit_card'].includes(productType)) {
            return res.status(400).json({
                code: 400,
                message: 'Invalid product type. Must be either "lender" or "credit_card".'
            });
        }

        const trendingProducts = await getTrendingProducts(
            productType,
            parseInt(limit, 10),
            parseInt(offset, 10),
            parseInt(lastCount, 10)
        );

        res.status(200).json({
            code: 200,
            message: 'Trending products retrieved successfully.',
            data: trendingProducts
        });
    } catch (err) {
        next(err);
    }
};