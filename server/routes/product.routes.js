import express from "express";
import {
  getAuctionProduct,
  getFutureProduct,
  getProduct,
  getAll,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/getall", getAll);
router.get("/", getAuctionProduct);
router.get("/future-product", getFutureProduct);
router.get("/:id", getProduct);
router.get("/seller/:id", getSellerProduct);
router.post("/", createProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
