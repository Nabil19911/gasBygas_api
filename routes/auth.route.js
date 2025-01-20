import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  employeeLogin,
  customerLogin,
  freshToken,
  register,
} from "../controllers/auth.controller.js";

const router = Router();

// Employee login
router.post("/employee/login", employeeLogin);

// Customer login
router.post("/login", customerLogin);

// Fresh token
router.post("/fresh-token", freshToken);

// Customer registration
router.post(
  "/register",
  upload.single("business_registration_certification_path"),
  register
);

export default router;
