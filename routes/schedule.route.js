import { Router } from "express";
import roles from "../constant/roles.js";
import {
  createSchedule,
  getSchedule,
  getScheduleById,
  updateScheduleById,
} from "../controllers/schedule.controller.js";
import authenticate from "../middleware/auth.js";

const router = Router();

// get all Schedule
router.get(
  "/",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  getSchedule
);

// get Schedule by ID
router.get(
  "/:id",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  getScheduleById
);

// update Schedule by ID
router.put(
  "/:id",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  updateScheduleById
);

// create Schedule
router.post(
  "/create/",
  authenticate([roles.ADMIN, roles.DISPATCH_OFFICER]),
  createSchedule
);

export default router;
