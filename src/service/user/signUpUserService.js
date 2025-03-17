import { createRequire } from "module";
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");
import { smtpConfig } from "../../configuration/smtpConfiguration.js";
import { validateUser } from "../../utils/validation.js";
import { decryptPassword, hashPassword } from "../../utils/encryption.js";
import { userRepository, getUserByEmail } from "../../repository/userRepository.js";
import { insertOtp } from "../../repository/otpRepository.js";
import { getParameter } from "../../repository/parameterRepository.js";
import bcrypt from "bcryptjs";
import pool from "../../configuration/dbConfiguration.js";

export const signUpUser = async ({ fullName, email, phoneNumber, password }) => {
    if (!fullName || !email || !phoneNumber || !password) {
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
        const hashedPassword = await hashPassword(decryptedPassword);

        let userId;
        if (!existingUser) {
            userId = await userRepository(fullName, email, phoneNumber, hashedPassword, client);
        } else {
            userId = existingUser.id;
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const hashedOtp = await bcrypt.hash(otpCode.toString(), 10);

        await insertOtp(email, hashedOtp, expiresAt, client);
        await client.query("COMMIT");

        sendOTP(email, otpCode, client, fullName).catch((err) => {
            console.error("Failed to send OTP:", err.message);
        });

        return {
            code: 201,
            message: "User registered, OTP sent.",
            data: { userId, email, otpExpiry: expiresAt }
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const sendOTP = async (email, otpCode, client, fullName) => {
    try {
        // Fetch OTP email template and subject from parameters table
        const otpTemplate = await getParameter("OTP_EMAIL_TEMPLATE", client);
        const otpSubject = await getParameter("OTP_EMAIL_SUBJECT", client);

        if (!otpTemplate || !otpSubject) {
            throw new Error("OTP email template or subject is missing in parameters table.");
        }

        // Replace placeholder {{OTP}} with actual OTP code
        const emailTextTemp = otpTemplate.replace("{{OTP}}", otpCode);
        const emailText = emailTextTemp.replace("{{custName}}", fullName);

        // Create transporter
        const transporter = nodemailer.createTransport(smtpConfig);

        // Email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: otpSubject,
            text: emailText
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending OTP email:", error.message);
    }
};
