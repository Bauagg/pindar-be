import {getParametersByGroup, updateParameterValue} from "../../repository/parameterRepository.js";

export const fetchParametersByGroup = async (group) => {
    return await getParametersByGroup(group);
};

export const modifyParameterValue = async (paramKey, paramValue) => {
    if (!paramValue) {
        throw { status: 400, message: "paramValue is required." };
    }

    const updatedParam = await updateParameterValue(paramKey, paramValue);
    if (!updatedParam) {
        throw { status: 404, message: "Parameter not found." };
    }

    return updatedParam;
};