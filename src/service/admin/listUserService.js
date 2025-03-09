import pool from "../../configuration/dbConfiguration.js";
import {getAdminUsers, getTotalAdminUsers} from "../../repository/userRepository.js";


export const listUsersService = async (limit, offset, search, sortBy, sortDirection) => {
    const client = await pool.connect();

    try {
        // Ensure sortBy is a valid column
        const allowedSortColumns = { fullName: "full_name", email: "email" };
        sortBy = allowedSortColumns[sortBy] || "full_name"; // Default sort column

        // Ensure sortDirection is valid
        const sortOrder = sortDirection.toLowerCase() === "desc" ? "DESC" : "ASC";

        // Fetch total user count for pagination
        const total = await getTotalAdminUsers(search, client);
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.floor(offset / limit) + 1;

        // Fetch admin users
        const users = await getAdminUsers(limit, offset, search, sortBy, sortOrder, client);

        return {
            code: 200,
            message: "User list retrieved successfully.",
            data: {
                users,
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
