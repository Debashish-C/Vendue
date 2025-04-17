import { query } from "../db/db.js";

export const getAllProduct = async (req, res) => {
  try {
    const result = await query("SELECT * FROM product");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, base_price } = req.body;

    if (!name || !base_price) {
      return res
        .status(400)
        .json({ message: "Name and base price are required." });
    }

    const result = await query(
      "INSERT INTO product (name, base_price) VALUES ($1, $2) RETURNING *",
      [name, base_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await query("SELECT * FROM product WHERE product_id = $1", [
      productId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

    res
      .status(200)
      .json({ message: "Product deleted", product: result.rows[0] });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
