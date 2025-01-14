import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createNewUser,
  getAllUsers,
  getUserProfile,
} from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Example resource route
router.get("/", authenticate([roles.ADMIN]), getAllUsers);

// Get customer profile route
router.post(
  "/profile/",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  getUserProfile
);

router.post(
  "/create/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER]),
  createNewUser
);

export default router;
