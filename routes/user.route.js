import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createNewUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserProfile,
  updateProfile,
  updateUserById,
} from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Get all user
router.get("/", authenticate([roles.ADMIN]), getAllUsers);

// get user by id
router.get("/:id", authenticate([roles.ADMIN]), getUserById);

// update user by id
router.patch("/:id", authenticate([roles.ADMIN]), updateUserById);

router.patch(
  "/profile/update/",
  authenticate([
    roles.ADMIN,
    roles.BRANCH_MANAGER,
    roles.CUSTOMER,
    roles.DELIVERY_OFFICER,
    roles.DISPATCH_OFFICER,
  ]),
  updateProfile
);

// Default route
router.post(
  "/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER]),
  getUserByEmail
);

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
  upload.single("business_registration_certification_path"),
  createNewUser
);

export default router;
