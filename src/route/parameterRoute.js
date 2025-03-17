import express from "express";
import {getParameter, getParametersByGroup, updateParameter} from "../controller/parameterController.js";

const router = express.Router();

router.get("/group/:group", getParametersByGroup);
router.put("/:paramKey", updateParameter);
router.get("/:paramKey", getParameter);

export default router;
