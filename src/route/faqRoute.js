import express from "express";
import {
    createProductFaq,
    getProductFaqs,
    getProductFaqById,
    updateProductFaq,
    deleteProductFaq
} from "../controller/faqController.js";

const router = express.Router();

router.post("/create", createProductFaq);
router.get("/list/:productType", getProductFaqs);
router.get("/detail/:id", getProductFaqById);
router.put("/update/:id", updateProductFaq);
router.delete("/delete/:id", deleteProductFaq);

export default router;
