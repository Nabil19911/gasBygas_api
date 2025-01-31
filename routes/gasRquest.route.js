import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createNewGasRequest,
  getGasRequest,
  getOutletGasRequest,
  patchOutletGasRequest,
} from "../controllers/gasRequest.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

router.get(
  "/",
  authenticate([
    roles.ADMIN,
    roles.DISPATCH_OFFICER,
    roles.BRANCH_MANAGER,
    roles.CUSTOMER,
  ]),
  getGasRequest
);

router.get(
  "/outlet/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  getOutletGasRequest
);

router.patch(
  "/outlet/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  patchOutletGasRequest
);

router.post(
  "/create/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.CUSTOMER]),
  createNewGasRequest
);

export default router;
