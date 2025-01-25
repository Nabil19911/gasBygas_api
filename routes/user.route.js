import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createNewUser,
  getAllUsers,
  getUserById,
  getUserProfile,
} from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// Get all user
router.get("/", authenticate([roles.ADMIN]), getAllUsers);

// get user by id
router.get("/:id", authenticate([roles.ADMIN]), getUserById);

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
