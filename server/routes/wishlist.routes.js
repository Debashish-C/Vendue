import express from "express";
import {
  getWishList,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", getWishList);
router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);

export default router;
