import {getParametersByGroup} from "../../repository/parameterRepository.js";

export const fetchParametersByGroup = async (group) => {
    return await getParametersByGroup(group);
};