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
  updateOrganizationGasRequestById,
  getIndividualGasRequestById,
  updateIndividualGasRequestById,
  updateReallocateIndividualGasRequestById,
  updateReallocateGasRequestToCustomerById,
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
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
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

router.patch(
  "/individual/reallocate/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
  updateReallocateIndividualGasRequestById
);

router.patch(
  "/individual/reallocate-customer",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
  updateReallocateGasRequestToCustomerById
);

router.get(
  "/individual/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
  getIndividualGasRequestById
);

router.patch(
  "/individual/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER, roles.BRANCH_MANAGER]),
  updateIndividualGasRequestById
);

router.post(
  "/organization/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.CUSTOMER]),
  createOrganizationGasRequest
);

export default router;
