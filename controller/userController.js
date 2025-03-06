
import {signUpUser} from "../service/user/signUpUserService.js";
import {confirmOtpService} from "../service/user/confirmOtpService.js";
import {loginUserService} from "../service/auth/customerSignInService.js";
import {refreshTokenService} from "../service/auth/refreshTokenService.js";
import {listCustomersService} from "../service/user/listCustomerService.js";
import {updateCustomerStatusService} from "../service/user/updateCustomerStatusService.js";



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
        const { email, otp_code } = req.body;

        if (!email || !otp_code) {
            const error = new Error("Email and OTP code are required.");
            error.status = 400;
            throw error;
        }

        const response = await confirmOtpService(email, otp_code);
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
