import pool from "../../configuration/dbConfiguration.js";
import {getCustomers, getTotalCustomers} from "../../repository/userRepository.js";


export const listCustomersService = async (limit, offset, search, sortBy, sortDirection) => {
    const client = await pool.connect();

    try {
        // Ensure sortBy is a valid column
        const allowedSortColumns = { fullName: "full_name", email: "email" };
        sortBy = allowedSortColumns[sortBy] || "full_name"; // Default sort column

        // Ensure sortDirection is valid
        const sortOrder = sortDirection.toLowerCase() === "desc" ? "DESC" : "ASC";

        // Fetch total customer count for pagination
        const total = await getTotalCustomers(search, client);
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        // Fetch customer list
        const customers = await getCustomers(limit, offset, search, sortBy, sortOrder, client);

        return {
            code: 200,
            message: "Customer list retrieved successfully.",
            data: {
                customers,
                pagination: {
                    total,
                    totalPages,
                    currentPage,
                    size: limit
                }
            }
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
