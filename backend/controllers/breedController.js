import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function getALlBreeds (req, res) {
    try{ 
        const db = getDB();
        const breeds = await db.collection("Breed").find({}).toArray();
        res.json(breeds);
    }catch (err){
        res.status(500).json({message : "Failed to fetch breeds"});
    }
}
export async function getBreedsBySpecies(req, res){
    try {
        const db = getDB();
        const { speciesID} = req.params;

        const breeds = await db.collection("Breeds").find({speciesID: new ObjectId(speciesID)}).toArray();
        res.json(breeds);

    }catch(err){
        res.status(500).json({message: "Failed to fetch Breeds"});
    }
}
export async function createBreed(req, res){
    try{
        const db = getDB();
        const { name, speciesID} = req.body;
        if(!name || !speciesID){
            return res.status(400). json({message: "Messing required fields"});
        }
        const newBreed = {
            name, 
            speciesID
        };
        const result = await db.collection("Breed").insertOne(newBreed);

        res.status(201).json({message: "Inserted Breed in to collection"});
    }catch(err){
        res.status(500).json({message: " Failed to create breed"});
    }
}
export async function deleteBreed(req, res) {
    try {
        const db = getDB();
        const {id} = req.params;
        const result = await db.collection("Breed").deleteOne({_id: new ObjectId(id)});

        if (result.deletedCount === 0){
            return res.status(404).json({message: "Breed not Found"});
        }
        res.status(201).json({message: " Succesfull delete Breed"}); 
    } catch (err){
        res.status(500).json({message: "Failed to delete breed"});
    }
}