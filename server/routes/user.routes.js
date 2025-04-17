import express from "express";
import {
  getAllUsers,
  createUser,
  loginUser,
} from "../controllers/user.controller.js";

const router = express.Router();
router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/:id", loginUser);
export default router;
