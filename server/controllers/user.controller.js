import { query } from "../db/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const result = await query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUser = async (req, res) => {
  const { user_id, email, username, first_name, last_name } = req.body;

  try {
    const existing = await query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    if (existing.rows.length > 0) {
      return res.status(200).json({ message: "User already exists" });
    }

    const result = await query(
      `INSERT INTO users (user_id, email, username, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, email, username, first_name, last_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error storing user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
