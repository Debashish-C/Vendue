import express from "express";
import { getAllCatagory } from "../controllers/catagory.controller.js";

const router = express.Router();

router.get("/", getAllCatagory);

export default router;
