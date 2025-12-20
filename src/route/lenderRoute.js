import express from "express";
import {
    addLender,
    updateLender,
    deleteLender,
    listLenders,
    getLenderDetail,
    getLenderDropdown,
    updatePinValue,
    getLenderListPinned
} from "../controller/lenderController.js";


const router = express.Router();

router.post("/add", addLender);
router.put("/update", updateLender);
router.delete("/delete/:id", deleteLender);
router.get("/list", listLenders);
router.put("/update-pin/:id", updatePinValue);
router.get("/detail/:id", getLenderDetail);
router.get("/list-dropdown", getLenderDropdown);
router.get("/list-pinned", getLenderListPinned);

export default router;
