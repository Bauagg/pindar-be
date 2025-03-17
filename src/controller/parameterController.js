import {fetchParametersByGroup, modifyParameterValue} from "../service/parameter/parameterService.js";
import {fetchParameterByKey} from "../service/announcement/announcementService.js";

export const getParametersByGroup = async (req, res, next) => {
    try {
        const { group } = req.params;
        if (!group) {
            return res.status(400).json({ code: 400, message: "Missing required parameter: group" });
        }

        const parameters = await fetchParametersByGroup(group);
        res.status(200).json({
            code: 200,
            message: "Parameters retrieved successfully.",
            data: parameters
        });
    } catch (err) {
        next(err);
    }
};

export const updateParameter = async (req, res, next) => {
    try {
        const { paramValue } = req.body;
        const paramKey = req.params.paramKey;

        const updatedParam = await modifyParameterValue(paramKey, paramValue);

        res.status(200).json({
            code: 200,
            message: "Parameter updated successfully.",
            data: updatedParam
        });
    } catch (error) {
        next(error);
    }
};

export const getParameter = async (req, res, next) => {
    try {
        const paramKey = req.params.paramKey;
        const parameter = await fetchParameterByKey(paramKey);

        res.status(200).json({
            code: 200,
            message: "Parameter retrieved successfully.",
            data: parameter
        });
    } catch (error) {
        next(error);
    }
};