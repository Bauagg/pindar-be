export const insertRefreshToken = async (userId, refreshToken, expiryTime, client) => {
    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, $3);
    `;
    await client.query(query, [userId, refreshToken, expiryTime]);
};
