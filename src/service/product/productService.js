import {fetchLenders} from "../../repository/lenderRepository.js";
import {fetchSearchProducts} from "../../repository/productRepository.js";

export const getProducts = async (search = "") => {
    const  products  = await fetchSearchProducts(
        search
    );

    return {
        products, code:200, message:"here is the products"
    };
};