import pool from "../configuration/dbConfiguration.js";


export const insertCreditCard = async (data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            `INSERT INTO credit_card (image_id, publisher_id, feature_type_id, yearly_fee, detail_yearly_fee, title, 
                                additional_card_annual_fee, purchase_rate, cashback_rate, detail_cashback_rate, 
                                minimum_withdraw, monthly_income_minimum, who_can_register, must_have_credit_card, 
                                created_by, yearly_income_minimum, monthly_minimum_payment, late_payment_charge_penalty,
                                      late_payment_admin_charge, maximum_withdraw_daily, main_card_minimum_age,
                                      main_card_maximum_age, additional_card_minimum_age, direct_link
                         ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
       RETURNING id`,
            [
                data.imageId, data.publisherId, data.featureTypeId, data.rewardOrFee, data.detailRewardOrFee, data.title,
                data.additionalCardAnnualFee, data.purchaseRate, data.cashbackRate, data.detailCashbackRate,
                data.minimumWithdraw, data.monthlyIncomeMinimum, data.whoCanRegister, data.mustHaveCreditCard,
                data.createdBy, data.yearlyIncomeMinimum,
                data.monthlyMinimumPayment,
                data.latePaymentChargePenalty,
                data.latePaymentAdminCharge,
                data.maximumWithdrawDaily,
                data.mainCardMinimumAge,
                data.mainCardMaximumAge,
                data.additionalCardMinimumAge,
                data.redirectLink
            ]
        );

        const cardId = rows[0].id;

        await client.query(
            `INSERT INTO credit_card_detail (card_id, terms_document, bill_payment_tutorial, detail_information, main_feature, all_facilities, fee_and_charges)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                cardId, data.termsDocument, data.billPaymentTutorial, data.detailInformation, data.mainFeature, data.allFacilities, data.feeAndCharges
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
        `SELECT c.id,
                c.title,
                c.yearly_fee,
                c.additional_card_annual_fee,
                c.purchase_rate,
                c.cashback_rate,
                c.monthly_income_minimum,
                c.yearly_income_minimum,
                c.monthly_minimum_payment,
                c.late_payment_charge_penalty,
                c.late_payment_admin_charge,
                c.maximum_withdraw_daily,
                c.main_card_minimum_age,
                c.main_card_maximum_age,
                c.additional_card_minimum_age,
                cd.detail_information,
                cd.terms_document,
                cd.bill_payment_tutorial,
                cd.main_feature,
                cd.all_facilities,
                cd.fee_and_charges,
                cp.id AS publisher_id,
                cp.publisher_name,
                cf.id AS type_id,
                cf.feature_name AS type_name,
                c.direct_link, 
                CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS image_link
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
                 must_have_credit_card = $14, updated_by = $15, updated_date = NOW(), yearly_income_minimum = $17, direct_link = $18 
             WHERE id = $16 AND is_deleted = FALSE`,
            [
                data.imageId, data.publisherId, data.featureTypeId, data.rewardOrFee, data.detailRewardOrFee, data.title,
                data.additionalCardAnnualFee, data.purchaseRate, data.cashbackRate, data.detailCashbackRate,
                data.minimumWithdraw, data.monthlyIncomeMinimum, data.whoCanRegister, data.mustHaveCreditCard,
                data.updatedBy, id, data.yearlyIncomeMinimum, data.redirectLink
            ]
        );

        // ✅ Update credit card detail
        await client.query(
            `UPDATE credit_card_detail 
             SET detail_information = $1, terms_document = $2,
                 bill_payment_tutorial = $3, main_feature = $4, all_facilities = $5, fee_and_charges = $6 
             WHERE card_id = $7`,
            [
                data.detailInformation, data.termsDocument, data.billPaymentTutorial, data.mainFeature, data.allFacilities, data.feeAndCharges, id
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

export const searchCreditCards = async (filters) => {
    const {
        publisherId,
        featureIds,
        minYearlyFee,
        maxYearlyFee,
        minYearlyIncome,
        maxYearlyIncome,
        sortBy,
        sortDirection,
        limit,
        offset,
        search
    } = filters;

    let baseQuery = `
        FROM credit_card c
        LEFT JOIN files f ON c.image_id = f.id 
        LEFT JOIN card_feature cf ON c.feature_type_id = cf.id 
        WHERE c.is_deleted = FALSE
    `;

    const queryParams = [];

    if (publisherId) {
        queryParams.push(publisherId);
        baseQuery += ` AND c.publisher_id = $${queryParams.length}`;
    }

    if (featureIds && featureIds.length > 0) {
        const placeholders = featureIds.map((_, index) => `$${queryParams.length + index + 1}`).join(",");
        queryParams.push(...featureIds);
        baseQuery += ` AND c.feature_type_id IN (${placeholders})`;
    }

    if (minYearlyFee !== undefined) {
        queryParams.push(minYearlyFee);
        baseQuery += ` AND c.yearly_fee >= $${queryParams.length}`;
    }

    if (maxYearlyFee !== undefined) {
        queryParams.push(maxYearlyFee);
        baseQuery += ` AND c.yearly_fee <= $${queryParams.length}`;
    }

    if (minYearlyIncome !== undefined) {
        queryParams.push(minYearlyIncome);
        baseQuery += ` AND c.yearly_income_minimum >= $${queryParams.length}`;
    }

    if (maxYearlyIncome !== undefined) {
        queryParams.push(maxYearlyIncome);
        baseQuery += ` AND c.yearly_income_minimum <= $${queryParams.length}`;
    }

    if (search) {
        queryParams.push(`%${search.toLowerCase()}%`);
        baseQuery += ` AND LOWER(c.title) LIKE $${queryParams.length}`;
    }

    // 1. Get total count
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count, 10);

    // 2. Get paginated rows
    const dataQuery = `
        SELECT c.id, c.title, c.yearly_fee, c.detail_yearly_fee, cf.feature_name, cf.id as benefit_id, c.direct_link,
               CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS image_link
        ${baseQuery} 
        ORDER BY ${sortBy} ${sortDirection}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    const dataParams = [...queryParams, limit, offset];
    const dataResult = await pool.query(dataQuery, dataParams);

    return {
        data: dataResult.rows,
        total
    };
};

export const fetchCreditCardFeatures = async (creditCardIds) => {
    if (!creditCardIds.length) return {};

    const placeholders = creditCardIds.map((_, i) => `$${i + 1}`).join(",");
    const query = `
        SELECT credit_card_id, feature_id, feature
        FROM credit_card_features
        WHERE credit_card_id IN (${placeholders})
    `;

    const result = await pool.query(query, creditCardIds);

    // Group features by credit_card_id
    const grouped = {};
    for (const row of result.rows) {
        if (!grouped[row.credit_card_id]) {
            grouped[row.credit_card_id] = [];
        }
        grouped[row.credit_card_id].push({
            feature: row.feature
        });
    }

    return grouped;
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
