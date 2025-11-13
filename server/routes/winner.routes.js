import { Router } from "express";
import { getWinner } from "../controllers/winner.controller";


const router  = Router();

router.get("/getwinner", getWinner);