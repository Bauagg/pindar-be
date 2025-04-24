import {addLenderService} from "../service/lender/createLenderService.js";
import {modifyLender} from "../service/lender/updateLenderService.js";
import {removeLender} from "../service/lender/deleteLenderService.js";
import {getLenders} from "../service/lender/searchLenderService.js";
import {getLenderDetailById, recordProductAccess} from "../service/lender/getLenderDetailService.js";
import {fetchLenderDropdown} from "../service/lender/getLenderDropdownService.js";

export const updateLender = async (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const lender = await modifyLender(req.body, userEmail);
        res.status(200).json({ code: 200, message: 'Lender updated successfully.', data: lender });
    } catch (err) {
        next(err);
    }
};
export const deleteLender = async (req, res, next) => {
    try {
        const lenderId = req.params.id;
        const userEmail = req.user.email;
        await removeLender(lenderId, userEmail);
        res.status(200).json({ code: 200, message: 'Lender deleted successfully', data: { id: lenderId } });
    } catch (err) {
        next(err);
    }
};

export const listLenders = async (req, res, next) => {
    try {
        const {
            loanType = "",
            paymentType = "",
            limit = 10,
            offset = 0,
            search = "",
            sortBy = "lender_name",
            sortDirection = "asc"
        } = req.query;

        const lenders = await getLenders({
            loanType,
            paymentType,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            search,
            sortBy,
            sortDirection
        });

        res.status(200).json({
            code: 200,
            message: "Lender list retrieved successfully.",
            data: lenders
        });
    } catch (err) {
        next(err);
    }
};

export const getLenderDetail = async (req, res, next) => {
    try {
        const lenderId = req.params.id;
        const lenderData = await getLenderDetailById(lenderId);

        let userId = null;
        if (req.user) {
            userId = req.user.id;
        }
        recordProductAccess('lender', lenderId, userId, req).catch(error => {
            console.error('Failed to record product access:', error);
        });
        res.status(200).json({
            code: 200,
            message: 'Lender detail retrieved successfully.',
            data: lenderData
        });
    } catch (err) {
        next(err);
    }
};

export const getLenderDropdown = async (req, res, next) => {
    try {
        const lenders = await fetchLenderDropdown();
        res.status(200).json({
            code: 200,
            message: 'Lender dropdown retrieved successfully.',
            data: lenders,
        });
    } catch (err) {
        next(err);
    }
};

export const addLender = async (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const lender = await addLenderService(req.body, userEmail);
        res.status(201).json({ code: 201, message: 'Lender created successfully.', data: lender });
    } catch (err) {
        next(err);
    }
};