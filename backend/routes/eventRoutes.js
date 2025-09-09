// backend/routes/eventRoutes.js
import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all events (with info if logged-in user is registered)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT e.id, e.title, e.description, e.host_id, u.user_name AS host_name,
             e.date_time, e.duration, e.category, e.banner_image, e.registered_count,
             CASE WHEN er.id IS NOT NULL THEN true ELSE false END AS is_registered
      FROM events e
      JOIN users u ON e.host_id = u.id
      LEFT JOIN event_registrations er 
        ON er.event_id = e.id AND er.user_id = $1
      WHERE e.date_time > NOW()   -- ✅ only future events
      ORDER BY e.date_time ASC
    `,
      [userId]
    );

    const events = result.rows.map((e) => {
      const dateTimeIso =
        e.date_time instanceof Date
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
        hostId: e.host_id,
        image: e.banner_image,
        description: e.description,
        registeredCount: e.registered_count,
        duration: e.duration,
        isRegistered: e.is_registered,
      };
    });

    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching events." });
  }
});

// POST create new event
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      category,
      duration,
      dateTime,
      banner_image,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO events (title, description, host_id, date_time, duration, category, banner_image, registered_count, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0, NOW())
      RETURNING id, title, description, host_id, date_time, duration, category, banner_image, registered_count
      `,
      [title, description, userId, dateTime, duration, category, banner_image]
    );

    const e = result.rows[0];
    const dateTimeIso =
      e.date_time instanceof Date
        ? e.date_time.toISOString()
        : new Date(e.date_time).toISOString();

    const event = {
      id: e.id,
      title: e.title,
      description: e.description,
      category: e.category,
      duration: e.duration,
      dateTime: dateTimeIso,
      date: dateTimeIso.split("T")[0],
      time: dateTimeIso.split("T")[1].slice(0, 5),
      hostId: e.host_id,
      instructor: req.user.user_name || "You",
      image: e.banner_image,
      registeredCount: e.registered_count,
      isRegistered: false,
    };

    res.status(201).json({ event });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error while creating event." });
  }
});

export default router;
