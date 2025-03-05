import { fetchUser } from "../service/user/getAllusers.js";
import {signUpUser} from "../service/user/signUpUserService.js";
import {confirmOtpService} from "../service/user/confirmOtpService.js";
import {loginUserService} from "../service/user/loginService.js";
import {refreshTokenService} from "../service/security/refreshTokenService.js";



export const getUsers = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0, search = "", sortBy, sortDirection } = req.query;

        const response = await fetchUser(
            parseInt(limit, 10),
            parseInt(offset, 10),
            search,
            sortBy,
            sortDirection
        );

        res.status(response.code).json(response);
    } catch (error) {
        next(error); // Pass the error to Express error handler
    }
};

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

