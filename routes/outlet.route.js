import { Router } from "express";
import roles from "../constant/roles.js";

import {
  createNewOutlet,
  getAllOutlets,
} from "../controllers/outlet.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// get all outlets
router.get("/", authenticate(roles.ADMIN), getAllOutlets);

// create outlet
router.post("/create/", authenticate([roles.ADMIN]), createNewOutlet);

export default router;
