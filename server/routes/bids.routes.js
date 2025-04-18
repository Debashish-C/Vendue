import express from "express";
import {
  getBidsForProduct,
  getUserBidsOnProduct,
  placeBid,
} from "../controllers/bids.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("All bids route (optional)");
});

router.get("/product/:productId", getBidsForProduct);
router.get("/user/:userId/product/:productId", getUserBidsOnProduct);
router.post("/", placeBid);

export default router;
