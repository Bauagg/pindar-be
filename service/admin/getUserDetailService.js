import pool from "../../configuration/dbConfiguration.js";
import {getUserById} from "../../repository/userRepository.js";


export const getUserDetailService = async (id) => {
    const client = await pool.connect();

    try {
        // Fetch user details
        const user = await getUserById(id, client);
        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }

        if (user.isDeleted) {
            const error = new Error("User is deleted.");
            error.status = 403;
            throw error;
        }

        return {
            code: 200,
            message: "User details retrieved successfully.",
            data: user
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
