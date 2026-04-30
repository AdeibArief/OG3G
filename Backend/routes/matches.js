import express from "express";
import protect from "../middleware/protect.js";
import { getAllMatches, getaMatch, saveMatch } from "../controller/matchesController.js";

const router = express.Router();

router.get("/getAllMatches", protect, getAllMatches);
router.get("/getaMatch/:id", protect, getaMatch);

router.post('/saveMatch',protect,saveMatch)


export default router

