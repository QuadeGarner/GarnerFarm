import express from 'express';

import {
    getAllBreeds,
    getBreedsBySpecies,
    createBreed,
    deleteBreed
} from '../controllers/breedController.js';

const router = express.Router();

router.get("/", getAllBreeds);
router.get("/species/:speciesId", getBreedsBySpecies);
router.post("/", createBreed);
router.delete("/:id", deleteBreed);

export default router;
