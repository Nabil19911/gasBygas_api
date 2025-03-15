import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createNewEmployee,
  getAllEmployees,
  getEmployeeByEmail,
  getEmployeeProfile,
  updateEmployeeById
} from "../controllers/employee.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Default route
router.get("/", authenticate([roles.ADMIN]), getAllEmployees);

// Default route
router.post("/", authenticate([roles.ADMIN]), getEmployeeByEmail);

// Get Employee Profile
router.post(
  "/profile/",
  authenticate([
    roles.ADMIN,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
    roles.DELIVERY_OFFICER,
  ]),
  getEmployeeProfile
);

// Patch Employee Profile
router.patch(
  "/profile/:id",
  authenticate([
    roles.ADMIN,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
    roles.DELIVERY_OFFICER,
  ]),
  updateEmployeeById
);

// Post Employee Profile - Create Employee
router.post("/create/", authenticate([roles.ADMIN]), createNewEmployee);

export default router;
