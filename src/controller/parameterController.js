import {fetchParametersByGroup} from "../service/parameter/getParameterByGroupService.js";

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