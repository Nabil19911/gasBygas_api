import { Router } from "express";
import roles from "../constant/roles.js";

import { createNewOutlet } from "../controllers/outlet.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Default route
// router.get("/", authenticate(roles.ADMIN), getAllEmployees);

// create outlet
router.post(
  "/create/",
  authenticate([roles.ADMIN]),
  createNewOutlet
);

export default router;
