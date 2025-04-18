import express from "express";
import {
  getWishList,
  addTowishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", getWishList);
router.post("/add", addTowishlist);
router.post("/remove", removeFromWishlist);

export default router;
