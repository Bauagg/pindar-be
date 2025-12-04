import express from "express";
import {getParameter, getParametersByGroup, updateParameter} from "../controller/parameterController.js";
import { getLoanType,  updateLoanType3 } from "../controller/loandType3Controller.js";


const router = express.Router();

router.get("/group/:group", getParametersByGroup);
router.put("/:paramKey", updateParameter);
router.get("/:paramKey", getParameter);
router.get("/loan-type-3/:lenderId", getLoanType);
router.post("/loan-type-3", updateLoanType3);

export default router;
