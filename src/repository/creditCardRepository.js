import pool from "../configuration/dbConfiguration.js";


export const insertCreditCard = async (data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            `INSERT INTO credit_card (image_id, publisher_id, feature_type_id, yearly_fee, detail_yearly_fee, title, 
                                additional_card_annual_fee, purchase_rate, cashback_rate, detail_cashback_rate, 
                                minimum_withdraw, monthly_income_minimum, who_can_register, must_have_credit_card, 
                                created_by, yearly_income_minimum) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id`,
            [
                data.imageId, data.publisherId, data.featureTypeId, data.rewardOrFee, data.detailRewardOrFee, data.title,
                data.additionalCardAnnualFee, data.purchaseRate, data.cashbackRate, data.detailCashbackRate,
                data.minimumWithdraw, data.monthlyIncomeMinimum, data.whoCanRegister, data.mustHaveCreditCard,
                data.createdBy, data.yearlyIncomeMinimum
            ]
        );

        const cardId = rows[0].id;

        await client.query(
            `INSERT INTO credit_card_detail (card_id, additional_information, terms_document, product_description, bill_payment_tutorial) 
       VALUES ($1, $2, $3, $4, $5)`,
            [
                cardId, data.additionalInformation, data.termsDocument, data.productDescription, data.billPaymentTutorial
            ]
        );

        // ✅ Insert multiple feature bullet points for the credit card
        for (const feature of data.features) {
            await client.query(
                `INSERT INTO credit_card_features (credit_card_id, feature) VALUES ($1, $2)`,
                [cardId, feature]
            );
        }

        await client.query('COMMIT');
        return { id: cardId };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getCreditCardById = async (id) => {
    const { rows } = await pool.query(
        `SELECT c.id, c.title, c.yearly_fee, c.additional_card_annual_fee, c.purchase_rate, c.cashback_rate, c.monthly_income_minimum, c.yearly_income_minimum,
                cd.additional_information, cd.terms_document, cd.product_description, cd.bill_payment_tutorial,
                cp.id AS publisher_id, cp.publisher_name,
                cf.id AS type_id, cf.feature_name AS type_name,
                CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id) ELSE NULL END AS image_link
         FROM credit_card c
                  JOIN credit_card_detail cd ON c.id = cd.card_id
                  JOIN card_publisher cp ON c.publisher_id = cp.id AND cp.is_deleted = FALSE
                  JOIN card_feature cf ON c.feature_type_id = cf.id AND cf.is_deleted = FALSE
                  LEFT JOIN files f ON c.image_id = f.id
         WHERE c.id = $1 AND c.is_deleted = FALSE`,
        [id]
    );

    if (!rows.length) return null;

    const creditCard = rows[0];

    // ✅ Fetch related features (bullet points)
    const featureRows = await pool.query(
        `SELECT feature FROM credit_card_features WHERE credit_card_id = $1`,
        [id]
    );

    creditCard.features = featureRows.rows.map(row => row.feature);
    return creditCard;
};


export const updateCreditCardById = async (id, data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // ✅ Update credit card details
        await client.query(
            `UPDATE credit_card 
             SET image_id = $1, publisher_id = $2, feature_type_id = $3, yearly_fee = $4, 
                 detail_yearly_fee = $5, title = $6, additional_card_annual_fee = $7, 
                 purchase_rate = $8, cashback_rate = $9, detail_cashback_rate = $10, 
                 minimum_withdraw = $11, monthly_income_minimum = $12, who_can_register = $13, 
                 must_have_credit_card = $14, updated_by = $15, updated_date = NOW(), yearly_income_minimum = $17
             WHERE id = $16 AND is_deleted = FALSE`,
            [
                data.imageId, data.publisherId, data.featureTypeId, data.rewardOrFee, data.detailRewardOrFee, data.title,
                data.additionalCardAnnualFee, data.purchaseRate, data.cashbackRate, data.detailCashbackRate,
                data.minimumWithdraw, data.monthlyIncomeMinimum, data.whoCanRegister, data.mustHaveCreditCard,
                data.updatedBy, id, data.yearlyIncomeMinimum
            ]
        );

        // ✅ Update credit card detail
        await client.query(
            `UPDATE credit_card_detail 
             SET additional_information = $1, terms_document = $2, product_description = $3, 
                 bill_payment_tutorial = $4 
             WHERE card_id = $5`,
            [
                data.additionalInformation, data.termsDocument, data.productDescription, data.billPaymentTutorial, id
            ]
        );

        // ✅ Remove old features
        await client.query(
            `DELETE FROM credit_card_features WHERE credit_card_id = $1`, [id]
        );

        // ✅ Insert updated features
        for (const feature of data.features) {
            await client.query(
                `INSERT INTO credit_card_features (credit_card_id, feature) VALUES ($1, $2)`,
                [id, feature]
            );
        }

        await client.query('COMMIT');
        return { id };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


export const deleteCreditCardById = async (id) => {
    await pool.query(
        `UPDATE credit_card SET is_deleted = TRUE WHERE id = $1`,
        [id]
    );
};

export const searchCreditCards = async ({ publisherId, featureIds, minYearlyFee, maxYearlyFee, minYearlyIncome, maxYearlyIncome, sortBy, sortDirection, limit, offset }) => {
    let query = `
        SELECT c.id, c.title, c.yearly_fee, c.detail_yearly_fee, 
               CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS image_link
        FROM credit_card c
        LEFT JOIN files f ON c.image_id = f.id
        WHERE c.is_deleted = FALSE
    `;

    const queryParams = [];

    if (publisherId) {
        queryParams.push(publisherId);
        query += ` AND c.publisher_id = $${queryParams.length}`;
    }

    if (featureIds && featureIds.length > 0) {
        const placeholders = featureIds.map((_, index) => `$${queryParams.length + index + 1}`).join(",");
        queryParams.push(...featureIds);
        query += ` AND c.id IN (
            SELECT DISTINCT ccf.credit_card_id 
            FROM credit_card_features ccf
            WHERE ccf.feature IN (${placeholders})
        )`;
    }

    if (minYearlyFee !== undefined) {
        queryParams.push(minYearlyFee);
        query += ` AND c.yearly_fee >= $${queryParams.length}`;
    }

    if (maxYearlyFee !== undefined) {
        queryParams.push(maxYearlyFee);
        query += ` AND c.yearly_fee <= $${queryParams.length}`;
    }

    if (minYearlyIncome !== undefined) {
        queryParams.push(minYearlyIncome);
        query += ` AND c.yearly_income_minimum >= $${queryParams.length}`;
    }

    if (maxYearlyIncome !== undefined) {
        queryParams.push(maxYearlyIncome);
        query += ` AND c.yearly_income_minimum <= $${queryParams.length}`;
    }

    query += ` ORDER BY ${sortBy} ${sortDirection} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    queryParams.push(limit, offset);

    const { rows } = await pool.query(query, queryParams);
    return rows;
};

export const checkPublisherExists = async (publisherId) => {
    const { rows } = await pool.query(
        `SELECT id FROM card_publisher WHERE id = $1 AND is_deleted = FALSE`,
        [publisherId]
    );
    return rows.length > 0;
};

// ✅ Check if feature exists and is not deleted
export const checkFeatureExists = async (featureId) => {
    const { rows } = await pool.query(
        `SELECT id FROM card_feature WHERE id = $1 AND is_deleted = FALSE`,
        [featureId]
    );
    return rows.length > 0;
};

export const getCreditCards = async ({
                                         publisherId, featureId, minYearlyFee, maxYearlyFee,
                                         minYearlyIncome, maxYearlyIncome, sortBy, sortDirection,
                                         limit, offset
                                     }) => {
    const queryParams = [];
    let filterQuery = '';

    if (publisherId) {
        queryParams.push(publisherId);
        filterQuery += ` AND c.publisher_id = $${queryParams.length}`;
    }

    if (featureId) {
        queryParams.push(featureId);
        filterQuery += ` AND c.feature_type_id = $${queryParams.length}`;
    }

    if (minYearlyFee) {
        queryParams.push(minYearlyFee);
        filterQuery += ` AND c.yearly_fee >= $${queryParams.length}`;
    }

    if (maxYearlyFee) {
        queryParams.push(maxYearlyFee);
        filterQuery += ` AND c.yearly_fee <= $${queryParams.length}`;
    }

    if (minYearlyIncome) {
        queryParams.push(minYearlyIncome);
        filterQuery += ` AND c.yearly_income_minimum >= $${queryParams.length}`;
    }

    if (maxYearlyIncome) {
        queryParams.push(maxYearlyIncome);
        filterQuery += ` AND c.yearly_income_minimum <= $${queryParams.length}`;
    }

    const { rows } = await pool.query(
        `SELECT c.id, c.title, c.yearly_fee, c.detail_yearly_fee,
                ARRAY(
                    SELECT feature FROM credit_card_features WHERE credit_card_id = c.id
                ) AS feature_list
         FROM credit_card c
         WHERE c.is_deleted = FALSE ${filterQuery}
         ORDER BY ${sortBy} ${sortDirection}
         LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
        [...queryParams, limit, offset]
    );

    const totalResult = await pool.query(
        `SELECT COUNT(*) FROM credit_card c WHERE c.is_deleted = FALSE ${filterQuery}`,
        queryParams
    );

    return {
        creditCards: rows.map(formatCreditCardResponse),
        pagination: {
            total: parseInt(totalResult.rows[0].count, 10),
            totalPages: Math.ceil(totalResult.rows[0].count / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};

// ✅ Helper function to format response in camelCase
const formatCreditCardResponse = (creditCard) => ({
    id: creditCard.id,
    title: creditCard.title,
    yearlyFee: creditCard.yearly_fee,
    detailYearlyFee: creditCard.detail_yearly_fee,
    featureList: creditCard.feature_list
});
