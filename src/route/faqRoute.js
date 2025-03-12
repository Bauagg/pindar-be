const express = require("express");
const {createProductFaq, getProductFaqs, getProductFaqById, updateProductFaq, deleteProductFaq} = require("../controller/faqController.js");
const router = express.Router();

router.post('/create', createProductFaq);
router.get('/list/:productType', getProductFaqs);
router.get('/detail/:id', getProductFaqById);
router.put('/update/:id', updateProductFaq);
router.delete('/delete/:id', deleteProductFaq);

module.exports = router;