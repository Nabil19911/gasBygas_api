import { Router } from "express";
import authenticate from "../middleware/auth.js";
import roles from "../constant/roles.js";

const router = Router();

router.get("/", authenticate(roles.ADMIN), function (req, res) {
  res.send("respond with a resource");
});

export default router;
