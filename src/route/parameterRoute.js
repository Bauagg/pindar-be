import express from "express";
import { getParametersByGroup } from "../controller/parameterController.js";

const router = express.Router();

router.get("/group/:group", getParametersByGroup);

export default router;
