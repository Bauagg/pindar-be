
import {fetchLenderDropdownData} from "../../repository/lenderRepository.js";

export const fetchLenderDropdown = async () => {
    const lenders = await fetchLenderDropdownData();
    return lenders;
};