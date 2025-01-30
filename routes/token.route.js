import { Router } from "express";
import roles from "../constant/roles.js";
import authenticate from "../middleware/auth.js";
import { checkTokenValidation } from "../controllers/token.controller.js";

const router = Router();

// Check Token
router.get(
  "/check",
  authenticate([roles.ADMIN, roles.CUSTOMER, roles.BRANCH_MANAGER]),
  checkTokenValidation
);

export default router;
