import pool from "../configuration/dbConfiguration.js";

export const addLenderTransaction = async (data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const lenderResult = await client.query(
            `INSERT INTO lender (lender_name, direct_link, max_loan, max_tenor, loan_type, image_id, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
                data.lenderName,
                data.directLink,
                data.maxLoan,
                data.maxTenor,
                data.loanType,
                data.imageId,
                data.userEmail
            ]
        );

        const lenderId = lenderResult.rows[0].id;

        await client.query(
            `INSERT INTO lender_detail (lender_id, additional_information, terms_document)
             VALUES ($1, $2, $3)`,
            [lenderId, data.additionalInformation, data.termsDocument]
        );

        await client.query('UPDATE files SET is_used = true WHERE id = $1', [data.imageId]);

        const insertOtherLender = async (relatedIds, type) => {
            for (const relatedId of relatedIds) {
                const check = await client.query('SELECT id FROM lender WHERE id = $1', [relatedId]);
                if (!check.rowCount) {
                    throw { status: 400, message: `Invalid lender ID: ${relatedId}` };
                }

                await client.query(
                    `INSERT INTO other_lender (lender_id, related_lender_id, relation_type)
                     VALUES ($1, $2, $3)`,
                    [lenderId, relatedId, type]
                );
            }
        };

        await insertOtherLender(data.anotherLend, 'ANOTHER');
        await insertOtherLender(data.anotherLenderType, 'ANOTHER_TYPE');

        await client.query('COMMIT');

        return { id: lenderId };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const updateLenderById = async (client, data) => {
    await client.query(
        `UPDATE lender SET lender_name=$1, direct_link=$2, max_loan=$3, max_tenor=$4, loan_type=$5, image_id=$6, updated_by=$7, updated_date=NOW()
         WHERE id=$8`,
        [data.lenderName, data.directLink, data.maxLoan, data.maxTenor, data.loanType, data.imageId, data.userEmail, data.id]
    );
};

export const updateLenderDetailById = async (client, data) => {
    await client.query(
        `UPDATE lender_detail SET additional_information=$1, terms_document=$2 WHERE lender_id=$3`,
        [data.additionalInformation, data.termsDocument, data.id]
    );
};

export const updateFileUsage = async (client, imageId) => {
    await client.query('UPDATE files SET is_used = true WHERE id = $1', [imageId]);
};

export const deleteOtherLenders = async (client, lenderId) => {
    await client.query('DELETE FROM other_lender WHERE lender_id = $1', [lenderId]);
};

export const insertOtherLender = async (client, lenderId, relatedIds, type) => {
    for (const relatedId of relatedIds) {
        await client.query(
            `INSERT INTO other_lender (lender_id, related_lender_id, relation_type)
             VALUES ($1, $2, $3)`,
            [lenderId, relatedId, type]
        );
    }
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

export const fetchLenders = async (limit, offset, search, sortBy, sortDirection) => {
    const client = await pool.connect();

    try {
        const searchQuery = `%${search}%`;
        const lendersResult = await client.query(
            `SELECT l.id, l.lender_name, CONCAT('/api/file/image/', f.id, f.file_extension) AS imageLink, l.max_tenor AS maxTenor, l.max_loan AS maxLoan
             FROM lender l
                      LEFT JOIN files f ON l.image_id = f.id
             WHERE l.is_deleted = FALSE AND l.lender_name ILIKE $1
             ORDER BY ${sortBy} ${sortDirection}
                 LIMIT $2 OFFSET $3`,
            [searchQuery, limit, offset]
        );

        const totalResult = await client.query(
            `SELECT COUNT(*) FROM lender WHERE is_deleted = FALSE AND lender_name ILIKE $1`,
            [searchQuery]
        );

        return {
            lenders: lendersResult.rows,
            total: parseInt(totalResult.rows[0].count, 10)
        };
    } finally {
        client.release();
    }
};

export const findLenderById = async (id) => {
    const query = `
        SELECT
            l.lender_name,
            l.direct_link,
            l.max_loan,
            l.max_tenor,
            l.loan_type,
            ld.additional_information,
            ld.terms_document,
            CONCAT('/file/image/', f.id, f.file_extension) AS image_link,
            lt.type_name AS type_loan_total
        FROM lender l
                 LEFT JOIN lender_detail ld ON l.id = ld.lender_id
                 LEFT JOIN files f ON l.image_id = f.id::uuid
    LEFT JOIN loan_type lt ON l.max_loan BETWEEN lt.min_loan AND lt.max_loan
        WHERE l.id = $1 AND l.is_deleted = FALSE
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

export const findLenderRelationsByType = async (lenderId, relationType) => {
    const query = `
    SELECT rl.id, rl.lender_name,
      CONCAT('/file/image/', img.id, img.file_extension) AS image_link
    FROM other_lender ol
    JOIN lender rl ON ol.related_lender_id = rl.id
    LEFT JOIN files img ON rl.image_id = img.id::uuid
    WHERE ol.lender_id = $1 AND ol.relation_type = $2 AND rl.is_deleted = FALSE
  `;

    const { rows } = await pool.query(query, [lenderId, relationType]);

    return rows;
};