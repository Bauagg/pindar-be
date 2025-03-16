import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {getRefreshToken} from "../../repository/tokenRepository.js";
import {getTokenExpiration} from "../../repository/parameterRepository.js";
import pool from "../../configuration/dbConfiguration.js";

dotenv.config();

export const refreshTokenService = async (refreshToken) => {
    const client = await pool.connect();

    try {
        // Verify the provided refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Fetch the stored refresh token from the database
        const storedToken = await getRefreshToken(refreshToken, client);
        if (!storedToken || storedToken.revoked || new Date(storedToken.expires_at) < new Date()) {
            const error = new Error("Invalid or expired refresh token.");
            error.status = 401;
            throw error;
        }

        // Fetch token expiration time from the parameter table
        const accessTokenExpiryMinutes = await getTokenExpiration("ACCESS_TOKEN_EXPIRY_MINUTES", client);

        // Generate a new access token
        const accessTokenExpiryTime = new Date(Date.now() + accessTokenExpiryMinutes * 60000);
        const accessToken = jwt.sign(
            { email: decoded.email, roles: decoded.roles },
            process.env.JWT_SECRET,
            { expiresIn: `${accessTokenExpiryMinutes}m` }
        );

        return {
            code: 200,
            message: "New access token generated successfully.",
            data: {
                accessToken,
                accessTokenExpiryTime: accessTokenExpiryTime
            }
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
