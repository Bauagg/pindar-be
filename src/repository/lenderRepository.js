import pool from "../configuration/dbConfiguration.js";


export const updateLenderById = async (client, data) => {
    await client.query(
        `UPDATE lender SET lender_name=$1, direct_link=$2, max_loan=$3, max_tenor=$4, loan_type=$5, image_id=$6, updated_by=$7, updated_date=NOW()
         WHERE id=$8`,
        [data.lenderName, data.directLink, data.maxLoan, data.maxTenor, data.loanType, data.imageId, data.userEmail, data.id]
    );
};

export const updateFileUsage = async (client, imageId) => {
    await client.query('UPDATE files SET is_used = true WHERE id = $1', [imageId]);
};

export const deleteOtherLenders = async (client, lenderId) => {
    await client.query('DELETE FROM other_lender WHERE lender_id = $1', [lenderId]);
};

export const checkLenderExists = async (client, lenderId) => {
    const result = await client.query('SELECT id FROM lender WHERE id = $1', [lenderId]);
    return result.rowCount > 0;
};

export const softDeleteLender = async (client, lenderId, userEmail) => {
    await client.query(
        `UPDATE lender SET is_deleted = TRUE, updated_by = $1, updated_date = NOW() WHERE id = $2`,
        [userEmail, lenderId]
    );
};

export const fetchLenders = async (limit, offset, search, sortBy, sortDirection, loanType, paymentType) => {
    const client = await pool.connect();

    try {
        let paramIndex = 1;
        const queryParams = [];
        let filterConditions = "l.is_deleted = FALSE";

        if (search) {
            filterConditions += ` AND LOWER(l.lender_name) LIKE LOWER($${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        if (loanType) {
            const loanTypes = loanType.split(";").map(type => type.trim()).filter(Boolean).map(d=>d.toLowerCase());
            if (loanTypes.length > 0) {
                const loanPlaceholders = loanTypes.map(() => `$${paramIndex++}`);
                filterConditions += ` AND LOWER(l.loan_type) IN (${loanPlaceholders.join(", ")})`;
                queryParams.push(...loanTypes);
            }
        }

        if (paymentType) {
            const paymentTypes = paymentType.split(";").map(type => type.trim()).filter(Boolean).map(d=>d.toLowerCase());
            if (paymentTypes.length > 0) {
                const paymentPlaceholders = paymentTypes.map(() => `$${paramIndex++}`);
                filterConditions += ` AND LOWER(l.payment_type) IN (${paymentPlaceholders.join(", ")})`;
                queryParams.push(...paymentTypes);
            }
        }

        // Query for paginated results
        const lendersResult = await client.query(
            `SELECT l.id, l.lender_name AS lenderName, 
                    CONCAT('/api/file/image/', f.id, f.file_extension) AS imageLink, 
                    l.max_tenor AS maxTenor, 
                    l.max_loan AS maxLoan
             FROM lender l
             LEFT JOIN files f ON l.image_id = f.id
             WHERE ${filterConditions}
             ORDER BY ${sortBy} ${sortDirection}
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...queryParams, limit, offset]
        );

        // Query for total count
        const totalResult = await client.query(
            `SELECT COUNT(*) FROM lender l WHERE ${filterConditions}`,
            queryParams
        );

        return {
            lenders: lendersResult.rows,
            total: parseInt(totalResult.rows[0].count, 10)
        };
    } finally {
        client.release();
    }
};


export const fetchLenderDropdownData = async () => {
    const query = `
    SELECT 
      l.id,
      l.lender_name AS "lenderName",
      CONCAT('/file/image/', f.id, '.', f.file_extension) AS "imageLink"
    FROM lender l
    LEFT JOIN files f ON l.image_id = f.id::uuid
    WHERE l.is_deleted = FALSE
    ORDER BY l.lender_name ASC;
  `;

    const { rows } = await pool.query(query);
    return rows;
}

export const validateParamExist = async (client, paramKey, paramGroup) => {
    const { rows } = await client.query(
        'SELECT 1 FROM parameters WHERE param_key = $1 AND param_group = $2',
        [paramKey, paramGroup]
    );
    if (rows.length === 0) throw { status: 400, message: `${paramKey} not found in ${paramGroup}` };
};

export const insertLender = async (client, { lenderName, directLink, maxLoan, loanType, paymentType, maxTenor, imageId, userEmail }) => {
    const { rows } = await client.query(
        `INSERT INTO lender (lender_name, direct_link, max_loan, loan_type, payment_type, max_tenor, image_id, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [lenderName, directLink, maxLoan, loanType, paymentType, maxTenor, imageId, userEmail]
    );
    return rows[0].id;
};

export const insertLenderDetail = async (client, { lenderId, additionalInformation, termsDocument, basicInfo, plusValue, applymentTutorial }) => {
    await client.query(
        `INSERT INTO lender_detail (lender_id, additional_information, terms_document, basic_info, plus_value, applyment_tutorial)
     VALUES ($1,$2,$3,$4,$5,$6)`,
        [lenderId, additionalInformation, termsDocument, basicInfo, plusValue, applymentTutorial]
    );
};

export const insertOtherLender = async (client, lenderId, relatedIds, relationType) => {
    if (!relatedIds || !Array.isArray(relatedIds)) return;

    for (const relatedId of relatedIds) {
        await client.query(
            `INSERT INTO other_lender (lender_id, related_lender_id, relation_type)
       VALUES ($1,$2,$3)`,
            [lenderId, relatedId, relationType]
        );
    }
};

export const validateLenderExists = async (client, id) => {
    const { rows } = await client.query(
        'SELECT 1 FROM lender WHERE id = $1 AND is_deleted = FALSE',
        [id]
    );
    if (rows.length === 0) throw { status: 404, message: 'Lender not found.' };
};

export const updateLenderData = async (client, { id, lenderName, directLink, maxLoan, loanType, paymentType, maxTenor, imageId, userEmail }) => {
    await client.query(
        `UPDATE lender 
     SET lender_name = $1, direct_link = $2, max_loan = $3, loan_type = $4, payment_type = $5, 
         max_tenor = $6, image_id = $7, updated_by = $8, updated_date = NOW()
     WHERE id = $9`,
        [lenderName, directLink, maxLoan, loanType, paymentType, maxTenor, imageId, userEmail, id]
    );
};

export const updateLenderDetail = async (client, { id, additionalInformation, termsDocument }) => {
    await client.query(
        `UPDATE lender_detail 
     SET additional_information = $1, terms_document = $2
     WHERE lender_id = $3`,
        [additionalInformation, termsDocument, id]
    );
};

export const deleteOtherLenderRelations = async (client, lenderId) => {
    await client.query(
        'DELETE FROM other_lender WHERE lender_id = $1',
        [lenderId]
    );
};

export const findLenderById = async (id) => {
    const query = `
        SELECT
            l.lender_name,
            l.direct_link,
            l.max_loan,
            l.max_tenor,
            lt.param_value AS type_loan_total,
            lt.param_key as type_loan_total_id,
            p.param_value AS payment_type_name,
            p.param_key as payment_type_id,
            ld.additional_information,
            ld.terms_document,
            ld. basic_info,
            ld.plus_value,
            ld.applyment_tutorial,
            CONCAT('/file/image/', f.id, f.file_extension) AS image_link
        FROM lender l
                 LEFT JOIN lender_detail ld ON l.id = ld.lender_id
                 LEFT JOIN files f ON l.image_id = f.id::uuid
    LEFT JOIN parameters lt ON l.loan_type = lt.param_key AND lt.param_group = 'LENDER_LOAN_TYPE'
            LEFT JOIN parameters p ON l.payment_type = p.param_key AND p.param_group = 'LENDER_PAYMENT_TYPE'
        WHERE l.id = $1 AND l.is_deleted = FALSE
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const findLenderRelationsByType = async (lenderId, relationType) => {
    const { rows } = await pool.query(`
    SELECT rl.id, rl.lender_name,
      CONCAT('/file/image/', img.id, img.file_extension) AS image_link
    FROM other_lender ol
    JOIN lender rl ON ol.related_lender_id = rl.id
    LEFT JOIN files img ON rl.image_id = img.id::uuid
    WHERE ol.lender_id = $1 AND ol.relation_type = $2 AND rl.is_deleted = FALSE
  `, [lenderId, relationType]);

    return rows;
};