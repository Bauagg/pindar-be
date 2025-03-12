import pool from "../../configuration/dbConfiguration.js";
import {
    checkEmailExists,
    checkPhoneNumberExists,
    getCustomerById,
    updateCustomerInDB
} from "../../repository/userRepository.js";


export const updateCustomerService = async (id, email, fullName, userName, phoneNumber, address) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Fetch existing customer
        const customer = await getCustomerById(id, client);
        if (!customer) {
            const error = new Error("Customer not found.");
            error.status = 404;
            throw error;
        }

        if (customer.isDeleted) {
            const error = new Error("Customer is deleted and cannot be updated.");
            error.status = 403;
            throw error;
        }

        // Check if new email is unique (if changed)
        if (email && email !== customer.email) {
            const emailExists = await checkEmailExists(email, id, client);
            if (emailExists) {
                const error = new Error("Email is already in use.");
                error.status = 409;
                throw error;
            }
        }

        // Check if new phone number is unique (if changed and not null)
        if (phoneNumber && phoneNumber !== customer.phoneNumber) {
            const phoneExists = await checkPhoneNumberExists(phoneNumber, id, client);
            if (phoneExists) {
                const error = new Error("Phone number is already in use.");
                error.status = 409;
                throw error;
            }
        }

        // Update customer details
        await updateCustomerInDB(id, email, fullName, userName, phoneNumber, address, client);
        await client.query("COMMIT");

        return {
            code: 200,
            message: "Customer details updated successfully.",
            data: { id, email, fullName, userName, phoneNumber, address }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
