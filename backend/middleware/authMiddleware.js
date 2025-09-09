// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import pool from "../db.js";

/**
 * authenticateToken
 * - Verifies access token from httpOnly cookie (preferred) or Authorization header
 * - Checks token_version from DB to allow immediate revocation
 * - Loads minimal user row from DB and attaches to req.user
 */
export async function authenticateToken(req, res, next) {
  try {
    // 1) Extract token: prefer cookie `accessToken`, fallback to Authorization header
    let token = req.cookies?.accessToken || null;

    if (!token) {
      const authHeader = req.headers["authorization"] || "";
      token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    }

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // 2) Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 3) Load user from DB (minimal fields + token_version)
    const userId = payload.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const result = await pool.query(
      "SELECT id, user_name, email, created_at, token_version FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 4) Check token version to allow revocation
    if (payload.token_version !== user.token_version) {
      return res.status(401).json({ message: "Token revoked. Please login again" });
    }

    // 5) Attach user to req
    req.user = user;
    next();
  } catch (err) {
    console.error("authenticateToken error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * authorizeHost
 * - Checks if the authenticated user owns a resource
 */
export const authorizeHost = (getHostId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const hostId = await getHostId(req);
      if (!hostId) {
        return res.status(404).json({ message: "Resource not found" });
      }

      if (String(hostId) !== String(req.user.id)) {
        return res.status(403).json({ message: "Forbidden. Not the owner" });
      }

      next();
    } catch (err) {
      console.error("authorizeHost error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
};
