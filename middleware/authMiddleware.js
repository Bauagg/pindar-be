import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {apiPermissions} from "../configuration/apiPermission.js";

dotenv.config();

export const authenticateAndAuthorize = (req, res, next) => {
    try {
        const authHeader = req.headers["Authorization"] || req.headers["authorization"];
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const requestPath = req.path;

        // Check if the API path has defined permissions
        const allowedRoles = apiPermissions[requestPath];

        if (!allowedRoles) {
            // If API is not listed in config, it's public and doesn't require authentication
            return next();
        }

        if (!token) {
            const error = new Error("Access token required.");
            error.status = 401;
            throw error;
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                const error = new Error("Invalid or expired access token.");
                error.status = 403;
                throw error;
            }

            // Extract user roles from token
            const userRoles = decoded.roles || [];

            // Check if the user has at least one required role for this API
            const hasPermission = userRoles.some(role => allowedRoles.includes(role));

            if (!hasPermission) {
                const error = new Error("You do not have permission to access this resource.");
                error.status = 403;
                throw error;
            }

            req.user = decoded; // Attach user data (email, roles) to request object
            next();
        });
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};
