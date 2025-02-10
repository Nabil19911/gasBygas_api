import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createIndividualGasRequest,
  createOrganizationGasRequest,
  getGasRequest,
  getOrganizationGasRequest,
  getOrganizationGasRequestById,
  getOutletGasRequest,
  updateOutletGasRequestById,
  updateOrganizationGasRequestById
} from "../controllers/gasRequest.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

router.get(
  "/individual/",
  authenticate([
    roles.ADMIN,
    roles.DISPATCH_OFFICER,
    roles.BRANCH_MANAGER,
    roles.CUSTOMER,
  ]),
  getGasRequest
);

router.get(
  "/organization/",
  authenticate([
    roles.ADMIN,
    roles.DISPATCH_OFFICER,
    roles.BRANCH_MANAGER,
    roles.CUSTOMER,
  ]),
  getOrganizationGasRequest
);

router.get(
  "/outlet/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  getOutletGasRequest
);

router.patch(
  "/outlet/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  updateOutletGasRequestById
);

router.get(
  "/organization/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  getOrganizationGasRequestById
);

router.patch(
  "/organization/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  updateOrganizationGasRequestById
);

router.post(
  "/individual/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.CUSTOMER]),
  createIndividualGasRequest
);

router.post(
  "/organization/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.CUSTOMER]),
  createOrganizationGasRequest
);

export default router;
