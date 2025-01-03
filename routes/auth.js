import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import businessTypeConstant from "../constant/businessType.js";
import roles from "../constant/roles.js";
import checkIfExists from "../helper/checkIfExists.js";
import Customer from "../schema/customer.schema.js";
import User from "../schema/user.schema.js";

const router = Router();

router.post("/employee/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { password: hash, role } = await User.findOne({ role: roles.ADMIN });

    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
      return;
    }

    const user = { name: username, role };

    const accessToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user,
      },
      process.env.JWT_SECRET
    );
    res.send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if a customer exists with the provided username
    const customer = await Customer.findOne({ username });
    if (!customer) {
      return res
        .status(401)
        .send({ message: "Invalid credentials. Please try again." });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid credentials. Please try again." });
    }

    const user = {
      username: customer.username,
      email: customer.email,
      businessType: customer.businessType,
    };

    const accessToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user,
      },
      process.env.JWT_SECRET
    );

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

router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    business_type,
    nic,
    brfile,
    brn,
    contact,
    email,
    full_address,
    password,
  } = req.body;

  try {
    // Check for duplicate email
    await checkIfExists("email", email, "Email already in use.");

    // For 'Individual' business type, check NIC uniqueness
    if (business_type === businessTypeConstant.Individual) {
      await checkIfExists("nic", nic, "NIC already registered.");
    }

    // For 'Organization', check username and BRN uniqueness
    if (business_type === businessTypeConstant.Organization) {
      await checkIfExists("username", username, "Username already taken.");
      await checkIfExists("brn", brn, "BRN already taken.");
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // If business type is Individual, create username dynamically
    let generatedUsername = "";
    if (business_type === businessTypeConstant.Individual) {
      const nicWithoutAlphabets = nic.replace(/[A-Za-z]+$/, "");
      const nicLastFourDigits = nicWithoutAlphabets.slice(-4);
      generatedUsername = `${last_name}${nicLastFourDigits}`;
    }

    const data =
      business_type === businessTypeConstant.Organization
        ? {
            username,
            business_type,
            brfile,
            brn,
            contact,
            email,
            full_address,
            password: hashedPassword,
          }
        : {
            username: generatedUsername,
            first_name,
            last_name,
            business_type,
            nic,
            contact,
            email,
            full_address,
            password: hashedPassword,
          };

    // Create a new customer object
    const newCustomer = new Customer(data);
    const respond = await newCustomer.save();

    res
      .status(201)
      .send({ message: "Customer registered successfully.", data: respond });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
});

export default router;
