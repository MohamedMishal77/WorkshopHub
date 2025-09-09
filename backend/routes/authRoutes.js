// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const isProd = process.env.NODE_ENV === "production";

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  maxAge: 15 * 60 * 1000 // 15 minutes
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Helpers
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, token_version: user.token_version },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    // Password policy check
    const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and contain one special character."
      });
    }

    // Check if email exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (token_version defaults to 0 in DB schema)
    const result = await pool.query(
      `INSERT INTO users (user_name, email, password_hash)
       VALUES ($1, $2, $3) RETURNING id, user_name, email, token_version`,
      [user_name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Registration successful. Redirecting to login...",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + interval '7 days')`,
      [user.id, refreshToken]
    );

    // Send both tokens as httpOnly cookies
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Return minimal user info (no tokens in body)
    res.json({
      message: "Login successful. Redirecting to dashboard...",
      user: { id: user.id, email: user.email, user_name: user.user_name }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== REFRESH TOKEN (with rotation) ====================
router.post("/refresh", async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) return res.sendStatus(401);

  try {
    // Verify old refresh token
    const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);

    // Check DB for old token
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2",
      [oldRefreshToken, decoded.id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const userId = decoded.id;

    // Delete old refresh token (rotation)
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [
      oldRefreshToken
    ]);

    // Generate new refresh token
    const newRefreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d"
    });

    // Save new refresh token in DB
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + interval '7 days')`,
      [userId, newRefreshToken]
    );

    // Fetch user's token_version for access token payload
    const userRes = await pool.query(
      "SELECT id, email, token_version FROM users WHERE id = $1",
      [userId]
    );
    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    const user = userRes.rows[0];

    // Generate new access token
    const accessToken = generateAccessToken(user);

    // Send new cookies
    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    res.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

// ==================== LOGOUT ====================
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [
        refreshToken
      ]);
    }
    res.clearCookie("refreshToken", refreshCookieOptions);
    res.clearCookie("accessToken", accessCookieOptions);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== VALIDATE ACCESS TOKEN ====================
router.get("/validate", (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    res.json({
      valid: true,
      user: { id: decoded.id, email: decoded.email }
    });
  } catch (err) {
    console.error("Validate error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

export default router;
