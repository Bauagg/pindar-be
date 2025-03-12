import pool from "../configuration/dbConfiguration.js";


export const insertOtp = async (email, otpCode, expiresAt) => {
    const query = `
        INSERT INTO otp_sessions (user_email, otp_code, expires_at)
        VALUES ($1, $2, $3);
    `;
    await pool.query(query, [email, otpCode, expiresAt]);
};

export const getOtpByEmail = async (email, client) => {
    const query = `
        SELECT otp_code, expires_at FROM otp_sessions
        WHERE user_email = $1 AND is_verified = FALSE
        ORDER BY created_at DESC LIMIT 1;
    `;
    const { rows } = await client.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
};

export const markOtpAsVerified = async (email, client) => {
    const query = `
        UPDATE otp_sessions SET is_verified = TRUE
        WHERE user_email = $1;
    `;
    await client.query(query, [email]);
};

export const activateUser = async (email, client) => {
    const query = `
        UPDATE users SET status = 'ACTIVE' WHERE email = $1;
    `;
    await client.query(query, [email]);
};
