import { query } from "../db/db.js";
export const placeBid = async (req, res) => {
  const { user_id, product_id, bid_amount } = req.body;
  try {
    await query(
      `INSERT INTO bids (user_id, product_id, bid_amount)
         VALUES ($1, $2, $3)`,
      [user_id, product_id, bid_amount]
    );
    res.status(201).json({ message: "Bid placed successfully" });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBidsForProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const result = await query(
      `SELECT * FROM bids WHERE product_id = $1 ORDER BY bid_time DESC`,
      [product_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bids:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserBidsOnProduct = async (req, res) => {
  const { user_id, product_id } = req.params;
  try {
    const result = await query(
      `SELECT * FROM bids
         WHERE user_id = $1 AND product_id = $2
         ORDER BY bid_time DESC`,
      [user_id, product_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user bids:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
