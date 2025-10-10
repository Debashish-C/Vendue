import express from "express";
import { getAllCategories } from "../controllers/catagory.controller.js";

const router = express.Router();

router.get("/", getAllCategories);

export default router;
