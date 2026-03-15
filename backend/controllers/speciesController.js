import {getDB} from "../config/db.js";
import {ObjectId} from "mongodb";
// get all species
export async function getAllSpecies (req, res) {
    try {
        const db = getDB();
        const species = await db.collection("Species").find({}).toArray();
        res.json(species);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch species" });
    }
};
// get species by id
export async function getSpeciesById  (req, res) {
    try {
        const db = getDB();
        const { id } = req.params;
        const species = await db.collection("Species").findOne({ _id: new ObjectId(id) });
        if (species == null) return res.status(404).json({ message: "Species not found" });
        res.json(species);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch species" });
    }
};
// create new species
export async function addSpecies (req, res) {
    try {
        const db = getDB();
        const { name , scientificName} = req.body;
        if (!name || !scientificName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newSpecies = {
            name,
            scientificName
        };
        const result = await db.collection("Species").insertOne(newSpecies);
        res.status(201).json({ _id: result.insertedId, ...newSpecies });
    } catch (err) {
        res.status(500).json({ message: "Failed to add species" });
    }
};
// update species 
export async function updateSpecies  (req, res) {
    try {
        const db = getDB();
        const { id } = req.params;
        const { name, scientificName } = req.body;
        if (!name || !scientificName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const updatedSpecies = {
            name,
            scientificName
        };
        const result = await db.collection("Species").updateOne(
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
};
// delete species 
export async function deleteSpecies(req, res) {
    try {
        const db = getDB();
        const { id } = req.params;

        const result = await db.collection("Species").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Species not found" });
        }

        res.json({ message: "Species deleted successfully" });

    } catch (err) {
        console.error("Delete species error:", err);
        res.status(500).json({ message: "Faild to delete species" });
    }
}
