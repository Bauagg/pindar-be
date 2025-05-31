import {signUpUser} from "../service/user/signUpUserService.js";
import {getProducts} from "../service/product/productService.js";

export const searchProduct = async (req, res, next) => {
    try {
        const result = await getProducts(req.query.search);
        res.status(result.code).json(result);
    } catch (error) {
        next(error); // Pass error to Express error handler
    }
};
