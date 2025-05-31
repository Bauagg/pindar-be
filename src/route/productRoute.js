import express from "express";
import {searchProduct} from "../controller/productController.js";

const router = express.Router();

router.get("/search", searchProduct);

export default router; // ✅ Use ES module export instead of module.exports
