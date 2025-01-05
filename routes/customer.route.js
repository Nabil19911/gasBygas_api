import { Router } from "express";
import authenticate from "../middleware/auth.js";
import roles from "../constant/roles.js";
import {
  getCustomers,
  getCustomerProfile,
} from "../controllers/customer.controller.js";

const router = Router();

// Example resource route
router.get("/", authenticate([roles.ADMIN]), getCustomers);

// Get customer profile route
router.post(
  "/profile/",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  getCustomerProfile
);

export default router;
