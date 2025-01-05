import { Router } from "express";
import authenticate from "../middleware/auth.js";
import roles from "../constant/roles.js";
import Employee from "../schema/employee.schema.js";

const router = Router();

router.get("/", authenticate(roles.ADMIN), function (req, res) {
  res.send("respond with a resource");
});

router.post(
  "/profile/",
  authenticate([roles.ADMIN, roles.BRANCH_MANAGER, roles.DISPATCH_OFFICER]),
  async function (req, res) {
    const { username } = req.body;
    try {
      const employee = await Employee.findOne({
        username,
      });
      if (!employee) {
        throw Error("Employee is not found");
      }

      const userData = {
        first_name: employee.first_name,
        last_name: employee.last_name,
        username: employee.username,
        role: employee.role,
      };

      res.status(200).send({ data: userData });
    } catch (error) {
      console.error("Something went wrong: ", error.message);
      res.status(401).send("Something went wront: " + error.message);
    }
  }
);

export default router;
