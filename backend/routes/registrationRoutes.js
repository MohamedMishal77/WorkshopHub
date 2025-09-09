// backend/routes/registrationRoutes.js
import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/registrations (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, event_id } = req.body;
    const userId = req.user.id;

    if (!name || !email || !phone || !event_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const phoneRegex = /^\+91\s\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be in +91 1234567890 format." });
    }

    const eventResult = await pool.query("SELECT id FROM events WHERE id = $1", [event_id]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    const existing = await pool.query(
      `SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2`,
      [event_id, userId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "You are already registered for this event." });
    }

    const result = await pool.query(
      `INSERT INTO event_registrations (event_id, user_id, name, email, phone, registered_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id`,
      [event_id, userId, name, email, phone]
    );

    await pool.query(
      `UPDATE events SET registered_count = registered_count + 1 WHERE id = $1`,
      [event_id]
    );

    res.status(201).json({
      message: "Registration successful.",
      registrationId: result.rows[0].id,
    });
  } catch (err) {
    console.error("Error registering for event:", err);
    res.status(500).json({ message: "Server error while registering." });
  }
});

// GET /api/registrations/mine (protected)
router.get("/mine", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT e.id, e.title, e.description, e.host_id, u.user_name AS host_name,
             e.date_time, e.duration, e.category, e.banner_image
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      JOIN users u ON e.host_id = u.id
      WHERE er.user_id = $1
        AND e.date_time > NOW()   -- ✅ only upcoming events
      ORDER BY e.date_time ASC
      `,
      [userId]
    );

    const events = result.rows.map(e => {
      const dateTimeIso = e.date_time instanceof Date
        ? e.date_time.toISOString()
        : new Date(e.date_time).toISOString();

      return {
        id: e.id,
        title: e.title,
        category: e.category,
        dateTime: dateTimeIso,
        date: dateTimeIso.split("T")[0],
        time: dateTimeIso.split("T")[1].slice(0, 5),
        instructor: e.host_name,
        image: e.banner_image,
        description: e.description,
        duration: e.duration,
      };
    });

    res.json({ events });
  } catch (err) {
    console.error("Error fetching my events:", err);
    res.status(500).json({ message: "Server error while fetching your events." });
  }
});

// GET /api/registrations/event/:eventId (protected, only host can see)
router.get("/event/:eventId", authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const hostCheck = await pool.query(
      "SELECT host_id FROM events WHERE id = $1",
      [eventId]
    );
    if (hostCheck.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (parseInt(hostCheck.rows[0].host_id) !== parseInt(userId)) {
      return res.status(403).json({ message: "Forbidden: Not the host" });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, registered_at
       FROM event_registrations
       WHERE event_id = $1
       ORDER BY registered_at ASC`,
      [eventId]
    );

    res.json({ registrations: result.rows });
  } catch (err) {
    console.error("Error fetching event registrations:", err);
    res.status(500).json({ message: "Server error while fetching registrations." });
  }
});

export default router;
