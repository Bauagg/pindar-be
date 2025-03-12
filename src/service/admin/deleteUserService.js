import pool from "../../configuration/dbConfiguration.js";
import {getUserByEmail, softDeleteUser} from "../../repository/userRepository.js";


const ALLOWED_ROLES = ["ADMIN", "CREATE", "UPDATE", "DELETE"];

export const deleteUserService = async (email) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Fetch existing user
        const existingUser = await getUserByEmail(email, client);
        if (!existingUser) {
            const error = new Error("User not found.");
            error.status = 404;
            throw error;
        }

        if (existingUser.is_deleted) {
            const error = new Error("User is already deleted.");
            error.status = 400;
            throw error;
        }

        // Soft delete user
        await softDeleteUser(email, client);
        await client.query("COMMIT");

        return {
            code: 200,
            message: "User successfully deleted.",
            data: { email }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
