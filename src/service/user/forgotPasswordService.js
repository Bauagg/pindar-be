import crypto from "crypto";
import {getUserByEmail, updateUserPassword} from "../../repository/userRepository.js";
import {getParameterByKey} from "../../repository/parameterRepository.js";
import {hashPassword} from "../../utils/encryption.js";
import pool from "../../configuration/dbConfiguration.js";
import nodemailer from "nodemailer";
import {smtpConfig} from "../../configuration/smtpConfiguration.js";

export const forgotPassword = async ({ email }) => {
    if (!email) {
        throw { status: 400, message: "Email is required." };
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // ✅ Check if user exists
        const user = await getUserByEmail(email, client);
        if (!user) {
            throw { status: 404, message: "User not found." };
        }

        // ✅ Fetch email template from parameter table
        const emailTemplateParam = await getParameterByKey("FORGOT_PASSWORD_EMAIL_TEMPLATE", client);
        const emailSubjectParam = await getParameterByKey("FORGOT_PASSWORD_EMAIL_SUBJECT", client);

        if (!emailTemplateParam || !emailSubjectParam) {
            throw new Error("Forgot password email template or subject is missing in parameters table.");
        }

        // ✅ Generate a random password
        const newPassword = crypto.randomBytes(6).toString("hex"); // 12-character random password
        const hashedPassword = await hashPassword(newPassword);

        // ✅ Update user password in the database
        await updateUserPassword(email, hashedPassword, client);

        await client.query("COMMIT");

        // ✅ Send the new password to the user's email
        await sendForgotPasswordEmail(email, user.full_name, newPassword, emailTemplateParam.param_value, emailSubjectParam.param_value);

        return {
            code: 200,
            message: "New password sent to your email."
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const sendForgotPasswordEmail = async (email, fullName, newPassword, emailTemplate, emailSubject) => {
    try {
        // ✅ Replace placeholders in template
        const emailTextTemp = emailTemplate.replace("{{NEW_PASSWORD}}", newPassword);
        const emailText = emailTextTemp.replace("{{FULL_NAME}}", fullName);

        // ✅ Create transporter
        const transporter = nodemailer.createTransport(smtpConfig);

        // ✅ Email options
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: emailSubject,
            text: emailText
        };

        // ✅ Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending forgot password email:", error.message);
    }
};