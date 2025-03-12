import express from "express";
import {
    addLender,
    updateLender,
    deleteLender,
    listLenders,
    getLenderDetail,
    getLenderDropdown
} from "../controller/lenderController.js";

const router = express.Router();

router.post("/add", addLender);
router.put("/update", updateLender);
router.delete("/delete/:id", deleteLender);
router.get("/list", listLenders);
router.get("/detail/:id", getLenderDetail);
router.get("/list-dropdown", getLenderDropdown);

export default router;
