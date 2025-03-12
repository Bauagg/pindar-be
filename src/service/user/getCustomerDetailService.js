import pool from "../../configuration/dbConfiguration.js";
import {getCustomerDetailById} from "../../repository/userRepository.js";


export const getCustomerDetailService = async (id) => {
    const client = await pool.connect();

    try {
        // Fetch customer details
        const customer = await getCustomerDetailById(id, client);
        if (!customer) {
            const error = new Error("Customer not found.");
            error.status = 404;
            throw error;
        }

        if (customer.isDeleted) {
            const error = new Error("Customer is deleted.");
            error.status = 403;
            throw error;
        }

        if (customer.status !== "ACTIVE") {
            const error = new Error("Customer account is inactive.");
            error.status = 403;
            throw error;
        }

        return {
            code: 200,
            message: "Customer details retrieved successfully.",
            data: customer
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
