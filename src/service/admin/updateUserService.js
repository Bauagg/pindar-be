import pool from "../../configuration/dbConfiguration.js";
import {getUserByEmail, updateUserData} from "../../repository/userRepository.js";
import {getValidRoles, updateUserRoles} from "../../repository/roleRepository.js";


export const updateUserService = async (full_name, email, roles, status) => {
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
            const error = new Error("User is deleted and cannot be updated.");
            error.status = 403;
            throw error;
        }

        // Validate status
        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            const error = new Error("Invalid status. Only 'ACTIVE' or 'INACTIVE' are allowed.");
            error.status = 400;
            throw error;
        }

        // Validate roles
        const validRoles = await getValidRoles(roles, client);
        if (validRoles.length !== roles.length) {
            const error = new Error("One or more roles are invalid.");
            error.status = 400;
            throw error;
        }

        // Update user data (excluding password)
        await updateUserData(full_name, email, status, client);

        // Update user roles
        await updateUserRoles(existingUser.id, validRoles, client);

        await client.query("COMMIT");

        return {
            code: 200,
            message: "User successfully updated.",
            data: { email, status, roles: validRoles }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
