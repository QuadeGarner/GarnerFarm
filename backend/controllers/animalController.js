import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function getAllAnimals (req, res) {
    try{ 
        const db = getDB();
        const animals = await db.collection("Animals").find({}).toArray();
        res.json(animals);
    }catch (err){
        res.status(500).json({message : "Failed to fetch breeds"});
    }
}

export async function getAnimalsByBreed(req, res){
    try {
        const db = getDB();
        const { breedId} = req.params;

        const animals = await db.collection("Animals").find({breedId: new ObjectId(breedID)}).toArray();
        res.json(animals);

    }catch(err){
        res.status(500).json({message: "Failed to fetch Breeds"});
    }
}
export async function createAnimal(req, res){
    try{
        const db = getDB();
        const { name, breedId, dob, sex, mother, father} = req.body;
        if(!name || !breedId){
            return res.status(400). json({message: "Messing required fields"});
        }
        const newAnimal = {
            name, 
            breedId,
            dob,
            sex,
            mother,
            father
        };
        await db.collection("Animals").insertOne(newAnimal);

        res.status(201).json({message: "Inserted animal in to collection"});
    }catch(err){
        res.status(500).json({message: " Failed to create breed"});
    }
}

export async function updateAnimal(req, res) {
    try{
        const db = getDB();
        const {id} = req.params;
        const { name, breedId, dob, sex, mother, father} = req.body;
        // validate requerid fields
        if(!name || !breedId){
            return res.status(400).json({message: "Missing Requirements"});
        }
        const updatedAnimal = {
            name, 
            breedId: new ObjectId(breedId),
            dob,
            sex,
            mother, 
            father
        };
        // update the animal
        const resutl = await db.collection("Animals").updateOne(
            {_id: new ObjectId(id)},
            {$set : updatedAnimal}
        );
        if(result.matchedCount === 0){
            return res.status(404).json({message: " Animal Not Found"});
        }
        res.json({_id: id, ...updatedAnimal});
    }catch(err){
        console.error(err);
        res.status(500).json({message: " Failed to updated Animal"});
    }
    
}

export async function deleteAnimal(req, res) {
    try {
        const db = getDB();
        const {id} = req.params;
        const result = await db.collection("Animals").deleteOne({_id: new ObjectId(id)});

        if (result.deletedCount === 0){
            return res.status(404).json({message: "Breed not Found"});
        }
        res.status(200).json({message: " Succesfull delete Breed"}); 
    } catch (err){
        res.status(500).json({message: "Failed to delete breed"});
    }
}