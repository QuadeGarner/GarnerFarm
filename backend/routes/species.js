import express from "express";
import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const species = await db.collection("Animals").find({}).toArray();
        res.json(species);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch species" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const species = await db.collection("Animals").findOne({ _id: new ObjectId(id) });

        if(!species) {
            return res.status(404).json({ message: "Species not found" });
        }
        res.json(species);
    }catch (err) {
        res.status(500).json({ message: "Failed to fetch species" });
    }
});

router.post("/", async (req, res) => {
    try {
        const db = getDB();
        const { species, streetName, breed } = req.body;
        if (!species || !streetName || !breed) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newSpecies = {
            species,
            streetName,
            breed
        };
        const result = await db.collection("Animals").insertOne(newSpecies);
        res.status(201).json({ _id: result.insertedId, ...newSpecies });
    } catch (err) {
        res.status(500).json({ message: "Failed to add species" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { species, streetName, breed } = req.body;

        if (!species || !streetName || !breed) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const updatedSpecies = {
            species,
            streetName,
            breed
        };
        const result = await db.collection("Animals").updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedSpecies }
        );  
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Species not found" });
        }
        res.json({ _id: id, ...updatedSpecies });
    } catch (err) {
        res.status(500).json({ message: "Failed to update species" });
    }
});
router.put("/:id/breed", async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { breed } = req.body;
        if (!breed) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await db.collection("Animals").updateOne(
            { _id: new ObjectId(id) },
            { $push: { breed: { name: breed } } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Species not found" });
        }
        res.json({ message: "Breed added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add breed" });

    }
});

router.delete("/:id/breed", async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const { breed } = req.body;
        if (!breed) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const result = await db.collection("Animals").updateOne(
            { _id: new ObjectId(id) },
            { $pull: { breed: { name: breed } } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Species not found" });
        }
        res.json({ message: "Breed removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove breed" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();
        const { id } = req.params;
        const result = await db.collection("Animals").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Species not found" });
        }
        res.json({ message: "Species deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete species" });
    }
});

export default router;