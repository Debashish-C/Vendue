import express from "express";
import {
  getBidsForProduct,
  getUserBidsOnProduct,
  placeBid,
} from "../controllers/bids.controller.js";

const router = express.Router();

router.get("/products/:id", getBidsForProduct);
router.get("/user/:userId/product/:productId", getUserBidsOnProduct);
router.post("/", placeBid);

export default router;
