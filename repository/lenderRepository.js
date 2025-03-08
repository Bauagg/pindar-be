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