import {createLender} from "../service/lender/createLenderService.js";
import {modifyLender} from "../service/lender/updateLenderService.js";
import {removeLender} from "../service/lender/deleteLenderService.js";

export const addLender = async (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const result = await createLender(req.body, userEmail);
        res.status(200).json({ code: 200, message: 'Success', data: result });
    } catch (err) {
        next(err);
    }
};

export const updateLender = async (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const result = await modifyLender(req.body, userEmail);
        res.status(200).json({ code: 200, message: 'Success', data: result });
    } catch (err) {
        next(err);
    }
}
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
