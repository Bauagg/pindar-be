import {adminSignInService} from "../service/auth/adminSignInService.js";
import {addUserService} from "../service/admin/addUserService.js";


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

export const addUser = async (req, res, next) => {
    try {
        const { full_name, email, password, roles } = req.body;

        if (!full_name || !email || !password || !Array.isArray(roles) || roles.length === 0) {
            const error = new Error("Invalid input. Full name, email, password, and at least one role are required.");
            error.status = 400;
            throw error;
        }

        const response = await addUserService(full_name, email, password, roles);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};
