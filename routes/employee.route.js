import { Router } from "express";
import roles from "../constant/roles.js";
import {
  getAllEmployees,
  getEmployeeProfile,
} from "../controllers/employee.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Default route
router.get("/", authenticate(roles.ADMIN), getAllEmployees);

// Get Employee Profile
router.post(
  "/profile/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.DISPATCH_OFFICER]),
  getEmployeeProfile
);

export default router;
