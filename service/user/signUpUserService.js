
import nodemailer from "nodemailer";
import {smtpConfig} from "../../configuration/smtpConfiguration.js";
import {validateUser} from "../../utils/validation.js";
import {decryptPassword, hashPassword} from "../../utils/encryption.js";
import {userRepository, getUserByEmail} from "../../repository/userRepository.js";
import {insertOtp} from "../../repository/otpRepository.js";
import bcrypt from "bcryptjs";
import pool from "../../configuration/dbConfiguration.js";

export const signUpUser = async ({ full_name, email, phone_number, password }) => {
    if (!full_name || !email || !phone_number || !password) {
        const error = new Error("Invalid input data.");
        error.status = 400;
        throw error;
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const existingUser = await getUserByEmail(email, client);
        if (existingUser && existingUser.status === "ACTIVE") {
            const error = new Error("User already exists and is active.");
            error.status = 409; // HTTP 409 Conflict
            throw error;
        }

        const decryptedPassword = decryptPassword(password);
        const hashedPassword = await hashPassword(email, decryptedPassword);

        let userId;
        if (!existingUser) {
            userId = await userRepository(full_name, email, phone_number, hashedPassword, client);
        } else {
            userId = existingUser.id;
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const hashedOtp = await bcrypt.hash(otpCode.toString(), 10);

        await insertOtp(email, hashedOtp, expiresAt, client);
        await client.query("COMMIT");

        sendOTP(email, otpCode).catch((err) => {
            console.error("Failed to send OTP:", err.message);
        });
        return {
            code: 201,
            message: "User registered, OTP sent.",
            data: { userId, email, otp_expiry: expiresAt }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error; // Will be caught by the global error handler
    } finally {
        client.release();
    }
};


const sendOTP = async (email, otpCode) => {
    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otpCode}`
    };

    await transporter.sendMail(mailOptions);
};
