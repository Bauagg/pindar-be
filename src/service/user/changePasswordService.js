import bcrypt from "bcryptjs";
import {getCustomerPasswordById, updateCustomerPassword} from "../../repository/userRepository.js";
import pool from "../../configuration/dbConfiguration.js";
import {decryptPassword} from "../../utils/encryption.js";
export const changePasswordService = async (id, email, encryptedOldPassword, encryptedNewPassword) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Fetch existing password hash
        const customer = await getCustomerPasswordById(id, client);
        if (!customer) {
            const error = new Error("Customer not found.");
            error.status = 404;
            throw error;
        }

        if (customer.isDeleted) {
            const error = new Error("Customer is deleted and cannot change password.");
            error.status = 403;
            throw error;
        }

        // Decrypt passwords
        const decryptedOldPassword = decryptPassword(encryptedOldPassword);
        const decryptedNewPassword = decryptPassword(encryptedNewPassword);

        // Verify old password
        const isMatch = await bcrypt.compare(decryptedOldPassword, customer.password);
        if (!isMatch) {
            const error = new Error("Incorrect old password.");
            error.status = 401;
            throw error;
        }

        // Hash new password with email
        const hashedNewPassword = await bcrypt.hash(decryptedNewPassword, 10);

        // Update password in DB
        await updateCustomerPassword(id, hashedNewPassword, client);
        await client.query("COMMIT");

        return {
            code: 200,
            message: "Password changed successfully."
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
