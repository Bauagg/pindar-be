import pool from "../configuration/dbConfiguration.js";


export const insertCardPublisher = async ({ number, publisherName }) => {
    const { rows } = await pool.query(
        `INSERT INTO card_publisher (number, publisher_name) 
     VALUES ($1, $2) RETURNING *`,
        [number, publisherName]
    );
    return rows[0];
};

export const getAllCardPublishers = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM card_publisher WHERE is_deleted = FALSE ORDER BY number ASC`
    );
    return rows;
};

export const getCardPublisherById = async (id) => {
    const { rows } = await pool.query(
        `SELECT * FROM card_publisher WHERE id = $1 AND is_deleted = FALSE`,
        [id]
    );
    return rows[0];
};

export const updateCardPublisherById = async (id, { number, publisherName }) => {
    const { rows } = await pool.query(
        `UPDATE card_publisher 
     SET number = $1, publisher_name = $2
     WHERE id = $3 RETURNING *`,
        [number, publisherName, id]
    );
    return rows[0];
};

export const softDeleteCardPublisherById = async (id) => {
    await pool.query(
        `UPDATE card_publisher SET is_deleted = TRUE WHERE id = $1`,
        [id]
    );
};
