import { Router } from "express";
import roles from "../constant/roles.js";
import { getStock, updateStock } from "../controllers/stock.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// get all Stock
router.get(
  "/",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  getStock
);

// update Stock
router.put(
  "/update/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  updateStock
);

export default router;
