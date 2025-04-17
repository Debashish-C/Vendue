import { query } from "../db/db";

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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    const result = await query(
      "INSERT INTO users (useremail, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query(
      "SELECT * FROM users WHERE useremail = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user: result.rows[0] });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
