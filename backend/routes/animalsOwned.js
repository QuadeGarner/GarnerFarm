import express from "express";
import { getDB } from "../config/db.js";

const router = express.Router();

/**
 * GET all owned animals
 */
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const ownedAnimals = await db.collection("animalsOwned").find({}).toArray();

    res.json(ownedAnimals);
  } catch (err) {
    console.error("GET animalsOwned error:", err);
    res.status(500).json([]);
  }
});

/**
 * ADD a new owned animal
 */
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { name, birthdate, streetName, species, breed, sex, mother, father } =
      req.body;

    if (!name || !streetName || !breed || !sex) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!["Male", "Female"].includes(sex)) {
      return res.status(400).json({ message: "Invalid Sex Option" });
    }

    const newAnimal = {
      name,
      birthdate: new Date(birthdate) || null,
      streetName,
      species: species || null,
      breed,
      sex,
      mother: mother || null,
      father: father || null,
      createdAt: new Date(),
    };

    await db.collection("animalsOwned").insertOne(newAnimal);

    res.status(201).json(newAnimal);
  } catch (err) {
    console.error("POST animalsOwned error:", err);
    res.status(500).json({
      message: "Failed to add owned animal",
    });
  }
});

export default router;
