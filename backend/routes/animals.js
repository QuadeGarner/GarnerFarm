import express from "express";
import { getDB } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const animals = await db.collection("Animals").find({}).toArray();
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animals" });
  }
});

export default router;
