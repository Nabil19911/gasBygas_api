import { Router } from "express";
import authenticate from "../middleware/auth.js";
import roles from "../constant/roles.js";
import Customer from "../schema/customer.schema.js";

const router = Router();

router.get("/", authenticate([roles.ADMIN]), function (req, res) {
  res.send("respond with a resource");
});

router.post(
  "/profile/",
  authenticate([
    roles.ADMIN,
    roles.CUSTOMER,
    roles.BRANCH_MANAGER,
    roles.DISPATCH_OFFICER,
  ]),
  async function (req, res) {
    const { email } = req.body;
    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        throw Error("Customer is not found");
      }

      const organizationData = {
        brFile: customer.brFile,
        brn: customer.brn,
        business_type: customer.business_type,
        contact: customer.contact,
        createdBy: customer.createdBy,
        role: customer.createdBy,
        email: customer.email,
        full_address: {
          district: customer.full_address.district,
          post_code: customer.full_address.post_code,
          address: customer.full_address.address,
        },
        is_approved: customer.is_approved,
      };

      res.status(200).send({ data: organizationData });
    } catch (error) {
      console.error("Something went wrong: ", error.message);
      res.status(401).send("Something went wront: " + error.message);
    }
  }
);

export default router;
