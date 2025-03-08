import {createLender} from "../service/lender/createLenderService.js";

export const addLender = async (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const result = await createLender(req.body, userEmail);
        res.status(200).json({ code: 200, message: 'Success', data: result });
    } catch (err) {
        next(err);
    }
};