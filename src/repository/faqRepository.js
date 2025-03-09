import pool from "../configuration/dbConfiguration.js";


export const insertProductFaq = async ({ productType, informationTitle, detailInformation, orderNumber }) => {
    const { rows } = await pool.query(
        `INSERT INTO product_faq (product_type, information_title, detail_information, order_number) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [productType, informationTitle, detailInformation, orderNumber]
    );
    return rows[0];
};

export const getProductFaqsByType = async (productType) => {
    const { rows } = await pool.query(
        `SELECT * FROM product_faq WHERE LOWER(product_type) = LOWER($1) ORDER BY order_number ASC`,
        [productType]
    );
    return rows;
};

export const getProductFaqById = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM product_faq WHERE id = $1`, [id]);
    return rows[0];
};

export const updateProductFaqById = async (id, { productType, informationTitle, detailInformation, orderNumber }) => {
    const { rows } = await pool.query(
        `UPDATE product_faq 
     SET product_type = $1, information_title = $2, detail_information = $3, order_number = $4
     WHERE id = $5 RETURNING *`,
        [productType, informationTitle, detailInformation, orderNumber, id]
    );
    return rows[0];
};

export const deleteProductFaqById = async (id) => {
    await pool.query(`DELETE FROM product_faq WHERE id = $1`, [id]);
};
