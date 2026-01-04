import pool from "../configuration/dbConfiguration.js";

export const createNotification = async ({ userId, title, detail, link }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO notification (user_id, title, detail, link)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
      [userId, title, detail, link]
    );

    const notificationId = rows[0].id;

    console.log(userId, title, detail);

    if (userId) {
      await client.query(
        `INSERT INTO user_notification (user_id, notification_id, is_read, is_deleted)
                 VALUES ($1, $2, FALSE, FALSE)`,
        [userId, notificationId]
      );
    }

    await client.query("COMMIT");
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const markNotificationAsRead = async (userId, notificationId) => {
  await pool.query(
    `INSERT INTO user_notification (user_id, notification_id, is_read)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (user_id, notification_id) DO UPDATE SET is_read = TRUE`,
    [userId, notificationId]
  );
};

export const deleteNotificationForUser = async (userId, notificationId) => {
  await pool.query(
    `INSERT INTO user_notification (user_id, notification_id, is_deleted)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (user_id, notification_id) DO UPDATE SET is_deleted = TRUE`,
    [userId, notificationId]
  );
};

export const getNotifications = async (userId, limit, offset, filterByRead) => {
  let query = `
        SELECT n.id, n.title, n.detail, n.link, n.created_date,
               COALESCE(un.is_read, FALSE) AS is_read
        FROM notification n
        LEFT JOIN user_notification un ON n.id = un.notification_id AND un.user_id = $1
        WHERE n.is_deleted = FALSE AND (un.is_deleted IS NULL OR un.is_deleted = FALSE)
    `;

  const queryParams = [userId];

  if (filterByRead === "read") {
    query += ` AND un.is_read = TRUE`;
  } else if (filterByRead === "unread") {
    query += ` AND (un.is_read IS NULL OR un.is_read = FALSE)`;
  }

  query += ` ORDER BY n.created_date DESC LIMIT $${
    queryParams.length + 1
  } OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  const { rows } = await pool.query(query, queryParams);
  const totalCountResult = await pool.query(
    `SELECT COUNT(*) AS total FROM notification WHERE is_deleted = FALSE`
  );

  return {
    notifications: rows,
    total: parseInt(totalCountResult.rows[0].total, 10),
  };
};
