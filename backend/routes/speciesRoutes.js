import  express  from 'express';

import {
    getAllSpecies,
    getSpeciesById,
    addSpecies,
    updateSpecies,
    deleteSpecies
} from '../controllers/speciesController.js';

const router = express.Router();

router.get("/", getAllSpecies);
router.get("/:id", getSpeciesById);
router.post("/", addSpecies);
router.put("/:id", updateSpecies);
router.delete("/:id", deleteSpecies);

export default router;
