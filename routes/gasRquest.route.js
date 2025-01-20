import { Router } from "express";
import roles from "../constant/roles.js";
import { createNewGasRequest } from "../controllers/gasRequest.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

router.post(
  "/create/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.CUSTOMER]),
  createNewGasRequest
);

export default router;
