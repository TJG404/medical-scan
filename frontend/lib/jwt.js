import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export function createAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1m" }); // 15분
}

export function createRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }); // 7일
}

export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}
