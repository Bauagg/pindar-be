import {adminSignInService} from "../service/auth/adminSignInService.js";
import {addUserService} from "../service/admin/addUserService.js";
import {updateUserService} from "../service/admin/updateUserService.js";
import {deleteUserService} from "../service/admin/deleteUserService.js";


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

export const updateUser = async (req, res, next) => {
    try {
        const { full_name, email, roles, status } = req.body;

        if (!full_name || !email || !Array.isArray(roles) || roles.length === 0 || !status) {
            const error = new Error("Invalid input. Full name, email, status, and at least one role are required.");
            error.status = 400;
            throw error;
        }

        const response = await updateUserService(full_name, email, roles, status);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            const error = new Error("Email is required to delete a user.");
            error.status = 400;
            throw error;
        }

        const response = await deleteUserService(email);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};
