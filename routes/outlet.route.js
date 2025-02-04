import { Router } from "express";
import roles from "../constant/roles.js";

import {
  createNewOutlet,
  getAllOutletGasRequests,
  getAllOutlets,
  getOutletById,
  getOutletGasRequests,
  patchOutlet,
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

router.get(
  "/gas-request/",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
  getAllOutletGasRequests
);

router.get(
  "/gas-request/:id",
  authenticate([roles.BRANCH_MANAGER]),
  getOutletGasRequests
);

// get one outlet
router.get(
  "/:id",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.DISPATCH_OFFICER]),
  getOutletById
);

// patch all outlets
router.patch("/:id", authenticate([roles.BRANCH_MANAGER]), patchOutlet);

// create outlet
router.post("/create/", authenticate([roles.ADMIN]), createNewOutlet);

router.post(
  "/gas-request/",
  authenticate([roles.BRANCH_MANAGER]),
  requestNewGas
);

export default router;
