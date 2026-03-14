import express from "express";
import { ObjectId } from "mongodb";
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
 * GET a specific owned animal by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const animal = await db.collection("animalsOwned").findOne({ _id: new ObjectId(id) });

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    res.json(animal);
  } catch (err) {
    console.error("GET animalsOwned/:id error:", err);
    res.status(500).json({ message: "Failed to fetch animal" });
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
      birthdate: birthdate || null,
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

/**
 * UPDATE an owned animal by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { name, birthdate, streetName, species, breed, sex, mother, father } = req.body;

    if (!name || !streetName || !breed || !sex) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!["Male", "Female"].includes(sex)) {
      return res.status(400).json({ message: "Invalid Sex Option" });
    }

    const updatedAnimal = {
      name,
      birthdate: birthdate || null,
      streetName,
      species: species || null,
      breed,
      sex,
      mother: mother || null,
      father: father || null,
      updatedAt: new Date(),
    };

    const result = await db.collection("animalsOwned").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedAnimal }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Animal not found" });
    }

    res.json({ message: "Animal updated successfully" });
  } catch (err) {
    console.error("PUT animalsOwned/:id error:", err);
    res.status(500).json({
      message: "Failed to update animal",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const result = await db.collection("animalsOwned").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Animal not found" });
    }
  } catch (err) {
    console.error("DELETE animalsOwned/:id error:", err);
    res.status(500).json({
      message: "Failed to delete animal",
    });
  }
  res.status(201).json({ message: "Animal deleted successfully" });
});

export default router;
