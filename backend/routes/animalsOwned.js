import express from "express";
import { getDB } from "../config/db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const ownedAnimals = await db.collection("animalsOwned").find({}).toArray();
    res.json(ownedAnimals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fecth owned Animals" });
  }
});
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const { name, birthdate, streetName, breed, mother, father } = req.body;

    if (!streetName || !breed || !name || !birthdate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newAnimal = {
      name,
      birthdate: new Date(birthdate),
      streetName,
      species,
      breed,
      mother: mother || null,
      father: father || null,
      createAt: new Date(),
    };

    const result = await db.collection("animalsOwned").insertOne(newAnimal);

    res.status(201).json({ message: "Owned Animal added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add ownedAnimal" });
  }
});
export default router;
