import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  employeeLogin,
  customerLogin,
  freshToken,
  registerCustomer,
} from "../controllers/auth.controller.js";

const router = Router();

// Employee login
router.post("/employee/login", employeeLogin);

// Customer login
router.post("/login", customerLogin);

// Fresh token
router.post("/fresh-token", freshToken);

// Customer registration
router.post("/register", upload.single("brFile"), registerCustomer);

export default router;
