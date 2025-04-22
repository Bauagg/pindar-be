import pool from "../configuration/dbConfiguration.js";


export const insertProductFaq = async ({ productType, informationTitle, detailInformation, orderNumber }) => {
    const { rows } = await pool.query(
        `INSERT INTO product_faq (product_type, information_title, detail_information, order_number) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
        [productType, informationTitle, detailInformation, orderNumber]
    );
    return rows[0];
};

export const getProductFaqsByType = async (productType, limit, offset, search = "") => {
    const queryParams = [productType.toLowerCase()];
    let paramIndex = 2;

    let baseQuery = `
        SELECT * FROM product_faq
        WHERE LOWER(product_type) = $1
    `;
    let countQuery = `
        SELECT COUNT(*) FROM product_faq
        WHERE LOWER(product_type) = $1
    `;

    if (search.trim() !== "") {
        baseQuery += ` AND (information_title ILIKE $${paramIndex} OR detail_information ILIKE $${paramIndex})`;
        countQuery += ` AND (information_title ILIKE $${paramIndex} OR detail_information ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
    }

    baseQuery += ` ORDER BY order_number ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const client = await pool.connect();
    try {
        const dataResult = await client.query(baseQuery, queryParams);
        const countResult = await client.query(countQuery, queryParams.slice(0, paramIndex - 1));

        return {
            faqs: dataResult.rows,
            pagination: {
                total: parseInt(countResult.rows[0].count, 10),
                totalPages: Math.ceil(countResult.rows[0].count / limit),
                currentPage: Math.floor(offset / limit) + 1,
                size: limit
            }
        };
    } finally {
        client.release();
    }
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
