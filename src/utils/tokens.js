import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE;
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
console.log("ACCESS_TOKEN_EXPIRE", ACCESS_TOKEN_EXPIRE);
console.log("REFRESH_TOKEN_EXPIRE", REFRESH_TOKEN_EXPIRE);
console.log("JWT_ACCESS_SECRET", JWT_ACCESS_SECRET);
console.log("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);
/**
 * Generate Access Token
 * @param {Object} payload 
 * @returns {string}
 */
export const generateAccessToken = (payload) => {
    console.log("payload", payload);
    console.log("JWT_SECRET", JWT_ACCESS_SECRET);
    console.log("ACCESS_TOKEN_EXPIRE", ACCESS_TOKEN_EXPIRE);

    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRE,
    });
};

/**
 * Generate Refresh Token
 * @param {Object} payload 
 * @returns {string}
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRE,
    });
};

/**
 * Verify Token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
export const verifyToken = (token) => {
    try {
        console.log("token", token);
        console.log("JWT_SECRET", JWT_ACCESS_SECRET);
        return jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (error) {
        throw error;
    }
};
