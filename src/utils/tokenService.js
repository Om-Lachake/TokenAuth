const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken")

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "shhhhha";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "shhhhhhr";
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const signAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn: ACCESS_EXPIRES})
}

const signRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

const saveRefreshToken = async (userId, token) => {
    const tokenHash = hashToken(token);
    const decoded = jwt.decode(token); // get exp
    const expiresAt = new Date(decoded.exp * 1000);
    const doc = new RefreshToken({ user: userId, tokenHash, expiresAt });
    await doc.save();
    return doc;
} 

async function revokeRefreshTokenByHash(tokenHash, replacedByTokenHash = null) {
  await RefreshToken.findOneAndUpdate(
    { tokenHash },
    { revoked: true, replacedByToken: replacedByTokenHash }
  );
}

async function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const tokenHash = hashToken(token);
    const dbToken = await RefreshToken.findOne({
      tokenHash,
      user: decoded._id,
    });

    if (!dbToken || dbToken.revoked) {
      throw new Error("Refresh token revoked or not found");
    }
    return decoded; 
  } catch (err) {
    throw err;
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  hashToken,
  revokeRefreshTokenByHash,
  verifyRefreshToken,
};