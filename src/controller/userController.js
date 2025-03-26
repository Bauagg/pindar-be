
import {signUpUser} from "../service/user/signUpUserService.js";
import {confirmOtpService} from "../service/user/confirmOtpService.js";
import {loginUserService} from "../service/auth/customerSignInService.js";
import {refreshTokenService} from "../service/auth/refreshTokenService.js";
import {listCustomersService} from "../service/user/listCustomerService.js";
import {updateCustomerStatusService} from "../service/user/updateCustomerStatusService.js";
import {updateCustomerService} from "../service/user/updateCustomerService.js";
import {changePasswordService} from "../service/user/changePasswordService.js";
import {getCustomerDetailService} from "../service/user/getCustomerDetailService.js";
import {deleteRefreshTokenService} from "../service/user/logoutService.js";
import {forgotPassword} from "../service/user/forgotPasswordService.js";



export const signUp = async (req, res, next) => {
    try {
        const result = await signUpUser(req.body);
        res.status(result.code).json(result);
    } catch (error) {
        next(error); // Pass error to Express error handler
    }
};

export const confirmOtp = async (req, res, next) => {
    try {
        const { email, otpCode } = req.body;

        if (!email || !otpCode) {
            const error = new Error("Email and OTP code are required.");
            error.status = 400;
            throw error;
        }

        const response = await confirmOtpService(email, otpCode);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};


export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required.");
            error.status = 400;
            throw error;
        }

        const response = await loginUserService(email, password);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            const error = new Error("Refresh token is required.");
            error.status = 400;
            throw error;
        }

        const response = await refreshTokenService(refreshToken);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const listCustomers = async (req, res, next) => {
    try {
        const {
            limit = 10,
            offset = 0,
            search = "",
            sortBy = "fullName",
            sortDirection = "asc"
        } = req.query;

        const response = await listCustomersService(
            parseInt(limit),
            parseInt(offset),
            search,
            sortBy,
            sortDirection
        );

        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const updateCustomerStatus = async (req, res, next) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            const error = new Error("Id and status are required.");
            error.status = 400;
            throw error;
        }

        const response = await updateCustomerStatusService(id, status);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.user; // Extracted from Bearer Token
        const { email, fullName, userName, phoneNumber, address, imageId } = req.body;

        if (!id) {
            const error = new Error("Unauthorized access. User ID is required.");
            error.status = 401;
            throw error;
        }

        const response = await updateCustomerService(id, email, fullName, userName, phoneNumber, address, imageId);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { id, email } = req.user; // Extracted from Bearer Token
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            const error = new Error("Old password and new password are required.");
            error.status = 400;
            throw error;
        }

        const response = await changePasswordService(id, email, oldPassword, newPassword);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const getCustomerDetail = async (req, res, next) => {
    try {
        const { id } = req.user; // Extracted from Bearer Token

        if (!id) {
            const error = new Error("Unauthorized access. User ID is required.");
            error.status = 401;
            throw error;
        }

        const response = await getCustomerDetailService(id);
        res.status(response.code).json(response);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { id } = req.user; // Extract user ID from token
        await deleteRefreshTokenService(id);

        res.status(200).json({ code: 200, message: "Logged out successfully." });
    } catch (error) {
        next(error);
    }
};

export const forgotPasswordHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        const response = await forgotPassword({ email });

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};