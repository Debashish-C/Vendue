import { query } from "../db/db.js";

export const getAllCatagory = async (req, res) => {
  try {
    const result = await query("SELECT * FROM catagory");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching auction catagory", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
