import { Router } from "express";
import {
  createGasType,
  deleteGasType,
  getAllGasTypes,
  getGasTypeById,
  updateGasType,
} from "../controllers/gasType.controller.js";

const router = Router();

// Create a new gas type
router.post("/", createGasType);

// Read all gas types
router.get("/", getAllGasTypes);

// Read a single gas type by ID
router.get("/:id", getGasTypeById);

// Update a gas type by ID
router.patch("/:id", updateGasType);

// Delete a gas type by ID
router.delete("/:id", deleteGasType);

export default router;
