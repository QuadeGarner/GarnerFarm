import  express  from 'express';

import {
    getAllAnimals,
    getAnimalsByBreed,
    createAnimal,
    updateAnimal,
    deleteAnimal
} from '../controllers/animalController.js';

const router = express.Router();

router.get("/", getAllAnimals);
router.get("/breed/:breedId", getAnimalsByBreed);
router.post("/", createAnimal);
router.delete("/:id", deleteAnimal);

export default router;
