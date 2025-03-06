import pool from "../../configuration/dbConfiguration.js";
import {getCustomerById, updateCustomerStatusInDB} from "../../repository/userRepository.js";


export const updateCustomerStatusService = async (id, status) => {
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

        // Validate status
        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            const error = new Error("Invalid status. Only 'ACTIVE' or 'INACTIVE' are allowed.");
            error.status = 400;
            throw error;
        }

        // Update customer status
        await updateCustomerStatusInDB(id, status, client);
        await client.query("COMMIT");

        return {
            code: 200,
            message: "Customer status updated successfully.",
            data: { id, status }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
