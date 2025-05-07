import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {apiPermissions} from "../configuration/apiPermission.js";
import { match } from 'path-to-regexp';
import { promisify } from "util";

dotenv.config();

const verifyToken = promisify(jwt.verify); // convert to async function

export const authenticateAndAuthorize = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        const matchedPath = Object.keys(apiPermissions).find(pathPattern => {
            const matcher = match(pathPattern, { decode: decodeURIComponent });
            return matcher(req.path);
        });

        const allowedRoles = apiPermissions[matchedPath];

        // Public API
        if (!allowedRoles || allowedRoles.includes("PUBLIC")) {
            if (!token) return next(); // no token, allow public access

            try {
                req.user = await verifyToken(token, process.env.JWT_SECRET);
            } catch (err) {
                // invalid token for public route — still allow access
                return next();
            }

            return next();
        }

        // Protected API
        if (!token) {
            return res.status(401).json({ message: "Access token required." });
        }

        let decoded;
        try {
            decoded = await verifyToken(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired access token." });
        }

        const userRoles = decoded.roles || [];
        const hasPermission = userRoles.some(role => allowedRoles.includes(role));

        if (!hasPermission) {
            return res.status(403).json({ message: "You do not have permission to access this resource." });
        }

        req.user = decoded;
        next();
    } catch (err) {
        next(err); // fallback for unexpected errors
    }
};

