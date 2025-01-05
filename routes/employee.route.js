import { Router } from "express";
import authenticate from "../middleware/auth.js";
import roles from "../constant/roles.js";
import {
  getEmployeeProfile,
  getEmployees,
} from "../controllers/employee.controller.js";

const router = Router();

// Default route
router.get("/", authenticate(roles.ADMIN), getEmployees);

// Get Employee Profile
router.post(
  "/profile/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.DISPATCH_OFFICER]),
  getEmployeeProfile
);

export default router;
