import express from "express";
import {
  getAuctionProduct,
  getFutureProduct,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAuctionProduct);
router.get("/future-product", getFutureProduct);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
