import { Router } from "express";
import roles from "../constant/roles.js";

import {
  createNewOutlet,
  getAllOutletGasRequests,
  getAllOutlets,
  getOutletById,
  getOutletGasRequests,
  updateOutlet,
  requestNewGas,
} from "../controllers/outlet.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// get all outlets
router.get(
  "/",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  getAllOutlets
);

// get all outlets gas request
router.get(
  "/gas-request/",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
  getAllOutletGasRequests
);

// get outlet gas request by id
router.get(
  "/gas-request/:id",
  authenticate([roles.BRANCH_MANAGER]),
  getOutletGasRequests
);

// get outlet by id
router.get(
  "/:id",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.DISPATCH_OFFICER]),
  getOutletById
);

// patch outlet by id
router.patch("/:id", authenticate([roles.BRANCH_MANAGER]), updateOutlet);

// create new outlet
router.post("/create/", authenticate([roles.ADMIN]), createNewOutlet);

// create gas request for outlet
router.post(
  "/gas-request/",
  authenticate([roles.BRANCH_MANAGER]),
  requestNewGas
);

export default router;
