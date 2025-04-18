import { query } from "../db/db.js";

export const getWishList = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id" });
  }

  try {
    const result = await query(
      `
      SELECT p.* 
      FROM wish_list w
      JOIN product p ON w.product_id = p.product_id
      WHERE w.user_id = $1
      `,
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Internal Error", error);
    res.status(500).json({ message: "Error in wishlist server" });
  }
};

export const addTowishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Missing user_id or product_id" });
  }

  try {
    const response = await query(
      "INSERT INTO wish_list (user_id, product_id) VALUES ($1, $2)",
      [user_id, product_id]
    );
    console.log(response);
    res.status(201).json({ message: "Product added to wishlist!" });
  } catch (error) {
    console.log("Error adding to wishlist", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Missing user_id or product_id" });
  }

  try {
    await query(
      "DELETE FROM wish_list WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );
    res.status(200).json({ message: "Removed from wishlist." });
  } catch (error) {
    console.error("Error removing from wishlist", error);
    res.status(500).json({ message: "Server error" });
  }
};
