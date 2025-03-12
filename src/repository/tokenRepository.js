export const insertRefreshToken = async (userId, refreshToken, expiryTime, client) => {
    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, $3);
    `;
    await client.query(query, [userId, refreshToken, expiryTime]);
};

export const getRefreshToken = async (refreshToken, client) => {
    const query = `
        SELECT * FROM refresh_tokens
        WHERE token = $1 LIMIT 1;
    `;
    const { rows } = await client.query(query, [refreshToken]);
    return rows.length > 0 ? rows[0] : null;
};

export const revokeRefreshToken = async (refreshToken, client) => {
    const query = `
        UPDATE refresh_tokens SET revoked = TRUE WHERE token = $1;
    `;
    await client.query(query, [refreshToken]);
};