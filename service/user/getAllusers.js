import {getAllUsers, getUserCount} from "../../repository/user/getAllUser.js";

export const fetchUser = async (limit, offset, search, sortBy, sortDirection) => {
    try {
        const users = await getAllUsers(limit, offset, search, sortBy, sortDirection);
        const total = await getUserCount(search);

        return {
            code: 200,
            message: "Users retrieved successfully",
            data: { users, total }
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        };
    }
};
