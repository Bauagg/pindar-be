import pool from "../../configuration/dbConfiguration.js";
import {getUserByEmail, insertUser, reactivateUser} from "../../repository/userRepository.js";
import {decryptPassword, hashPassword} from "../../utils/encryption.js";
import {getValidRoles, updateUserRoles} from "../../repository/roleRepository.js";

export const addUserService = async (full_name, email, encryptedPassword, roles) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check if user already exists
        const existingUser = await getUserByEmail(email, client);

        if (existingUser) {
            if (!existingUser.is_deleted) {
                const error = new Error("User with this email already exists and is active.");
                error.status = 409;
                throw error;
            }

            // If user is marked as deleted, reactivate them
            await reactivateUser(existingUser.id, client);
        }

        // Validate roles
        const validRoles = await getValidRoles(roles, client);
        if (validRoles.length !== roles.length) {
            const error = new Error("One or more roles are invalid.");
            error.status = 400;
            throw error;
        }

        // Decrypt and hash password
        const decryptedPassword = decryptPassword(encryptedPassword);
        const hashedPassword = await hashPassword(decryptedPassword);

        let userId;
        if (!existingUser) {
            // Insert new user
            userId = await insertUser(full_name, null, email, hashedPassword, client);
        } else {
            userId = existingUser.id; // Use existing user ID if reactivating
        }

        // Assign roles to user
        await updateUserRoles(userId, validRoles, client);

        await client.query("COMMIT");

        return {
            code: 201,
            message: "User successfully created or reactivated with assigned roles.",
            data: { userId, email, roles: validRoles }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
