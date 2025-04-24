
import pool from "../configuration/dbConfiguration.js";

export const getTrendingProducts = async (productType = null, limit = 10, offset = 0, lastCount = 7) => {
    const client = await pool.connect();
    try {
        let query, countQuery;

        if (productType === 'lender') {
            // Query for lender products only
            query = `
                SELECT l.id, 'lender' AS product_type, l.lender_name AS name,
                       CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS "imageLink",
                       COUNT(pa.id) AS view_count
                FROM lender l
                LEFT JOIN files f ON l.image_id = f.id
                LEFT JOIN product_access pa ON l.id = pa.product_id 
                    AND pa.product_type = 'lender'
                    AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                WHERE l.is_deleted = FALSE
                GROUP BY l.id, f.id, f.file_extension
                HAVING COUNT(pa.id) > 0
                ORDER BY view_count DESC, l.lender_name
                LIMIT $1 OFFSET $2
            `;

            countQuery = `
                SELECT COUNT(DISTINCT l.id) 
                FROM lender l
                LEFT JOIN product_access pa ON l.id = pa.product_id 
                    AND pa.product_type = 'lender'
                    AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                WHERE l.is_deleted = FALSE
                HAVING COUNT(pa.id) > 0
            `;
        } else if (productType === 'credit_card') {
            // Query for credit card products only
            query = `
                SELECT cc.id, 'credit_card' AS product_type, cc.title AS name,
                       CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS "imageLink",
                       COUNT(pa.id) AS view_count
                FROM credit_card cc
                LEFT JOIN files f ON cc.image_id = f.id
                LEFT JOIN product_access pa ON cc.id = pa.product_id 
                    AND pa.product_type = 'credit_card'
                    AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                WHERE cc.is_deleted = FALSE
                GROUP BY cc.id, f.id, f.file_extension
                HAVING COUNT(pa.id) > 0
                ORDER BY view_count DESC, cc.title
                LIMIT $1 OFFSET $2
            `;

            countQuery = `
                SELECT COUNT(DISTINCT cc.id) 
                FROM credit_card cc
                LEFT JOIN product_access pa ON cc.id = pa.product_id 
                    AND pa.product_type = 'credit_card'
                    AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                WHERE cc.is_deleted = FALSE
                HAVING COUNT(pa.id) > 0
            `;
        } else {
            // Query for both product types when productType is null or empty
            countQuery = `
                SELECT 
                  (
                    SELECT COUNT(DISTINCT l.id) 
                    FROM lender l
                    LEFT JOIN product_access pa ON l.id = pa.product_id 
                        AND pa.product_type = 'lender'
                        AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                    WHERE l.is_deleted = FALSE
                    HAVING COUNT(pa.id) > 0
                  )
                  +
                  (
                    SELECT COUNT(DISTINCT cc.id) 
                    FROM credit_card cc
                    LEFT JOIN product_access pa ON cc.id = pa.product_id 
                        AND pa.product_type = 'credit_card'
                        AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                    WHERE cc.is_deleted = FALSE
                    HAVING COUNT(pa.id) > 0
                  ) AS count
            `;

            query = `
                (
                    SELECT l.id, 'lender' AS product_type, l.lender_name AS name,
                           CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS "imageLink",
                           COUNT(pa.id) AS view_count
                    FROM lender l
                    LEFT JOIN files f ON l.image_id = f.id
                    LEFT JOIN product_access pa ON l.id = pa.product_id 
                        AND pa.product_type = 'lender'
                        AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                    WHERE l.is_deleted = FALSE
                    GROUP BY l.id, f.id, f.file_extension
                    HAVING COUNT(pa.id) > 0
                )
                UNION ALL
                (
                    SELECT cc.id, 'credit_card' AS product_type, cc.title AS name,
                           CASE WHEN f.id IS NOT NULL THEN CONCAT('/file/image/', f.id, f.file_extension) ELSE NULL END AS "imageLink",
                           COUNT(pa.id) AS view_count
                    FROM credit_card cc
                    LEFT JOIN files f ON cc.image_id = f.id
                    LEFT JOIN product_access pa ON cc.id = pa.product_id 
                        AND pa.product_type = 'credit_card'
                        AND pa.access_date >= NOW() - INTERVAL '${lastCount} days'
                    WHERE cc.is_deleted = FALSE
                    GROUP BY cc.id, f.id, f.file_extension
                    HAVING COUNT(pa.id) > 0
                )
                ORDER BY view_count DESC, name
                LIMIT $1 OFFSET $2
            `;
        }

        const productsResult = await client.query(query, [limit, offset]);
        const totalResult = await client.query(countQuery);

        return {
            products: productsResult.rows,
            pagination: {
                total: parseInt(totalResult.rows[0]?.count || '0', 10),
                totalPages: Math.ceil((totalResult.rows[0]?.count || 0) / limit),
                currentPage: Math.floor(offset / limit) + 1,
                size: limit
            }
        };
    } finally {
        client.release();
    }
};