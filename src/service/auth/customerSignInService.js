import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getUserAndRoleByEmail,
  updateLastLogin,
} from "../../repository/userRepository.js";
import { getTokenExpiration } from "../../repository/parameterRepository.js";
import { insertRefreshToken } from "../../repository/tokenRepository.js";
import pool from "../../configuration/dbConfiguration.js";
import { decryptPassword } from "../../utils/encryption.js";
import { createNotification } from "../../repository/notificationRepository.js";

dotenv.config();

export const loginUserService = async (email, encryptedPassword) => {
  const client = await pool.connect();

  try {
    // Fetch user and roles
    const user = await getUserAndRoleByEmail(email, client);
    if (!user || user.status !== "ACTIVE") {
      const error = new Error("Invalid email or password.");
      error.status = 401;
      throw error;
    }

    // Decrypt the password sent in the request
    const decryptedPassword = decryptPassword(encryptedPassword);

    // Validate password
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password.");
      error.status = 401;
      throw error;
    }

    // Fetch token expiration times
    const accessTokenExpiryMinutes = await getTokenExpiration(
      "ACCESS_TOKEN_EXPIRY_MINUTES",
      client
    );
    const refreshTokenExpiryMinutes = await getTokenExpiration(
      "REFRESH_TOKEN_EXPIRY_MINUTES",
      client
    );

    // Calculate expiry timestamps
    const accessTokenExpiryTime = new Date(
      Date.now() + accessTokenExpiryMinutes * 60000
    );
    const refreshTokenExpiryTime = new Date(
      Date.now() + refreshTokenExpiryMinutes * 60000
    );

    // Generate JWT Access Token with multiple roles
    const accessToken = jwt.sign(
      { email: user.email, roles: user.roles, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: `${accessTokenExpiryMinutes}m` }
    );

    // Generate Refresh Token
    const refreshToken = jwt.sign(
      { email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: `${refreshTokenExpiryMinutes}m` }
    );

    // Store Refresh Token in DB
    await insertRefreshToken(
      user.id,
      refreshToken,
      refreshTokenExpiryTime,
      client
    );
    // Update last login timestamp
    await updateLastLogin(user.id, client);

    const now = new Date();

    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(now);

    const formattedTime = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);

    await createNotification({
      userId: user.id,
      title: "Login",
      detail: `Akun kamu berhasil login pada ${formattedDate} pukul ${formattedTime}`,
      link: "",
    });

    return {
      code: 200,
      message: "Login successful.",
      data: {
        fullName: user.full_name,
        imageLink: user.imagelink,
        accessToken,
        accessTokenExpiryTime: accessTokenExpiryTime,
        refreshToken,
        refreshTokenExpiryTime: refreshTokenExpiryTime,
      },
    };
  } finally {
    client.release();
  }
};
