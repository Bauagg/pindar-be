import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {getUserAndRoleByEmail} from "../../repository/userRepository.js";
import {decryptPassword} from "../../utils/encryption.js";
import {getTokenExpiration} from "../../repository/parameterRepository.js";
import {insertRefreshToken} from "../../repository/tokenRepository.js";
import pool from "../../configuration/dbConfiguration.js";

dotenv.config();

// Allowed roles for admin-like users
const ALLOWED_ROLES = ["ADMIN", "CREATE", "UPDATE", "DELETE", "READ"];

export const adminSignInService = async (email, encryptedPassword) => {
    const client = await pool.connect();

    try {
        // Fetch user details & roles
        const user = await getUserAndRoleByEmail(email, client);
        if (!user || user.status !== "ACTIVE") {
            const error = new Error("Invalid email or password.");
            error.status = 401;
            throw error;
        }

        // Check if user has at least one of the allowed roles
        const hasAllowedRole = user.roles.some(role => ALLOWED_ROLES.includes(role));
        if (!hasAllowedRole) {
            const error = new Error("Access denied. You are not authorized to log in here.");
            error.status = 403;
            throw error;
        }

        // Decrypt the password sent in the request
        const decryptedPassword = decryptPassword(encryptedPassword);

        // Validate password
        const isMatch = await bcrypt.compare(decryptedPassword, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password.");
            error.status = 401;
            throw error;
        }

        // Fetch token expiration times
        const accessTokenExpiryMinutes = await getTokenExpiration("ACCESS_TOKEN_EXPIRY_MINUTES", client);
        const refreshTokenExpiryMinutes = await getTokenExpiration("REFRESH_TOKEN_EXPIRY_MINUTES", client);

        // Calculate expiry timestamps
        const accessTokenExpiryTime = new Date(Date.now() + accessTokenExpiryMinutes * 60000);
        const refreshTokenExpiryTime = new Date(Date.now() + refreshTokenExpiryMinutes * 60000);

        // Generate JWT Access Token (includes roles)
        const accessToken = jwt.sign(
            { email: user.email, roles: user.roles, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: `${accessTokenExpiryMinutes}m` }
        );

        // Generate Refresh Token (Includes roles!)
        const refreshToken = jwt.sign(
            { email: user.email, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: `${refreshTokenExpiryMinutes}m` }
        );

        // Store Refresh Token in DB
        await insertRefreshToken(user.id, refreshToken, refreshTokenExpiryTime, client);

        return {
            code: 200,
            message: "Admin login successful.",
            data: {
                fullName: user.full_name,
                imageLink: user.imagelink,
                accessToken,
                accessTokenExpiryTime: accessTokenExpiryTime,
                refreshToken,
                refreshTokenExpiryTime: refreshTokenExpiryTime
            }
        };
    } finally {
        client.release();
    }
};
