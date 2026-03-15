import { express} from 'express';

import {
    getALlBreeds,
    getBreedsBySpecies,
    createBreed,
    deleteBreed
} from '../controllers/breedController';

const router = express.Router();

router.get("/", getALlBreeds);
router.get("/species/:speciesId", getBreedsBySpecies);
router.post("/", createBreed);
router.delete("/:id", deleteBreed);

export default router;
