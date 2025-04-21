import { query } from "../db/db.js";

export const getAuctionProduct = async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM product WHERE bids_start_date_time <= NOW() AND bids_end_date_time > NOW()"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching auction products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFutureProduct = async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM product WHERE bids_start_date_time > NOW()"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching future products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      product_base_price,
      catagory_id,
      description,
      bids_start_date_time,
      bids_end_date_time,
      created_by,
    } = req.body;

    if (
      !product_name ||
      !product_base_price ||
      !catagory_id ||
      !bids_start_date_time ||
      !bids_end_date_time
    ) {
      return res.status(400).json({
        message:
          "Product name, base price, category, bid start time, and bid end time are required.",
      });
    }

    const result = await query(
      "INSERT INTO product (product_name, product_base_price, catagory_id, description, bids_start_date_time, bids_end_date_time, created_by ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        product_name,
        product_base_price,
        catagory_id,
        description,
        bids_start_date_time,
        bids_end_date_time,
        created_by || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  const result = await query("SELECT * FROM product WHERE product_id = $1", [
    id,
  ]);
  if (result.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "Product not found bro", id: id || "id not found" });
  }
  res.json(result.rows[0]);
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, base_price } = req.body;

    const result = await query(
      "UPDATE product SET name = $1, base_price = $2 WHERE product_id = $3 RETURNING *",
      [name, base_price, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found to update" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await query(
      "DELETE FROM product WHERE product_id = $1 RETURNING *",
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found to delete" });
    }

    res.status(200).json({
      message: "Product deleted",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
