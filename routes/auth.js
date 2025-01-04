import bcrypt from "bcrypt";
import { Router } from "express";
import businessTypeConstant from "../constant/businessType.js";
import { createJWT } from "../helper/authHelper.js";
import { checkIfExists, prepareUserData } from "../helper/customerHelper.js";
import Customer from "../schema/customer.schema.js";
import Employee from "../schema/employee.schema.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/employee/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if a employee exists with the provided username and password is matched
    const employee = await Employee.findOne({ username });
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!employee || !isMatch) {
      res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
      return;
    }

    const user = { name: username, role: employee.role };
    const accessToken = createJWT(user);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if a customer exists with the provided email and password is matched
    const customer = await Customer.findOne({ email });
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!customer || !isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid credentials. Please try again." });
    }

    const user = {
      email: customer.email,
      businessType: customer.businessType,
    };
    const accessToken = createJWT(user);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
});

router.post("/fresh-token", (req, res) => {
  const { exp, role, username } = req.body;

  const user = { name: username, role };

  return bcrypt.sign(
    {
      exp: exp,
      data: user,
    },
    process.env.JWT_SECRET
  );
});

router.post("/register", upload.single("brFile"), async (req, res) => {
  const {
    first_name,
    last_name,
    business_type,
    nic,
    brn,
    contact,
    email,
    full_address,
    password,
    createdBy,
  } = req.body;

  try {
    // Check for duplicate email
    await checkIfExists({
      field: "email",
      value: email,
      errorMessage: "Email already in use.",
    });

    // For 'Individual' business type, check NIC uniqueness
    if (business_type === businessTypeConstant.Individual) {
      await checkIfExists({
        field: "nic",
        value: nic,
        errorMessage: "NIC already registered.",
      });
    }

    // For 'Organization', check BRN uniqueness and validate file upload
    if (business_type === businessTypeConstant.Organization) {
      await checkIfExists({
        field: "brn",
        value: brn,
        errorMessage: "BRN already taken.",
      });

      // Ensure a file was uploaded for BRN
      if (!req.file) {
        return res.status(400).send({
          message: "Business Registration File (brFile) is required.",
        });
      }
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare the data to be saved
    const data = prepareUserData({
      businessType: business_type,
      userDetails: {
        first_name,
        last_name,
        nic,
        brn,
        brFile:  req.file ? req.file.path : null, // Save file path if uploaded
        contact,
        email,
        full_address,
        hashedPassword,
        createdBy,
      },
    });

    // Create a new customer object
    const customer = new Customer(data);
    const respond = await customer.save();

    res.status(201).send({
      message: "Customer registered successfully.",
      data: respond,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
});

export default router;
