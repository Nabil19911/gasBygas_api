import { Router } from "express";
import roles from "../constant/roles.js";

import {
  createNewOutlet,
  getAllOutletGasRequests,
  getAllOutlets,
  getOutletGasRequests,
  requestGas,
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

// create outlet
router.post("/create/", authenticate([roles.ADMIN]), createNewOutlet);

router.post("/gas-request/", authenticate([roles.BRANCH_MANAGER]), requestGas);

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

export default router;
