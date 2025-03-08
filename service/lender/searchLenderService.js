import {fetchLenders} from "../../repository/lenderRepository.js";

const allowedSortColumns = ['lender_name', 'max_tenor', 'max_loan'];
const allowedSortDirections = ['asc', 'desc'];

export const getLenders = async ({ limit = 10, offset = 0, search = '', sortBy = 'lender_name', sortDirection = 'asc' }) => {
    if (!allowedSortColumns.includes(sortBy)) sortBy = 'lender_name';
    if (!allowedSortDirections.includes(sortDirection.toLowerCase())) sortDirection = 'asc';

    const { lenders, total } = await fetchLenders(parseInt(limit, 10), parseInt(offset, 10), search, sortBy, sortDirection);

    return {
        lenders,
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};