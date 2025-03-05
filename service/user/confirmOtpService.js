import bcrypt from "bcryptjs";
import pool from "../../configuration/dbConfiguration.js";
import {activateUser, getOtpByEmail, markOtpAsVerified} from "../../repository/otp/otpRepository.js";

export const confirmOtpService = async (email, otpCode) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Fetch OTP from DB
        const otpRecord = await getOtpByEmail(email, client);
        if (!otpRecord) {
            const error = new Error("Invalid or expired OTP.");
            error.status = 400;
            throw error;
        }

        // Check if OTP is expired
        if (new Date(otpRecord.expires_at) < new Date()) {
            const error = new Error("OTP has expired.");
            error.status = 400;
            throw error;
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otpCode, otpRecord.otp_code);
        if (!isMatch) {
            const error = new Error("Invalid OTP.");
            error.status = 400;
            throw error;
        }

        // Mark OTP as verified
        await markOtpAsVerified(email, client);

        // Activate the user
        await activateUser(email, client);

        await client.query("COMMIT");

        return { code: 200, message: "OTP confirmed. User activated." };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
