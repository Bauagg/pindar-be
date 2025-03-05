import {adminSignInService} from "../service/auth/adminSignInService.js";


export const adminSignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required.");
            error.status = 400;
            throw error;
        }

        const response = await adminSignInService(email, password);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};
