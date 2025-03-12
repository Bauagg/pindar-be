import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

export const decryptPassword = (encryptedPassword) => {
    const buffer = Buffer.from(encryptedPassword, "base64");
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        buffer
    );
    return decrypted.toString("utf8");
};

export const hashPassword = async (decryptedPassword) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(decryptedPassword, salt);
};
