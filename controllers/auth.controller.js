import bcrypt from "bcrypt";
import businessTypeConstant from "../constant/businessType.js";
import roles from "../constant/roles.js";
import { createJWT } from "../helper/authHelper.js";
import {
  checkIfExists,
  prepareCustomerData,
} from "../helper/customerHelper.js";
import Employee from "../models/employee.model.js";
import Customer from "../models/customer.model.js";

/**
 * Employee Login
 * @param {Request} req
 * @param {Response} res
 */
export const employeeLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employee = await Employee.findOne({ username });
    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
    }

    const user = { username, role: employee.role };
    const accessToken = createJWT(user);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
};

/**
 * Customer Login
 * @param {Request} req
 * @param {Response} res
 */
export const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
    }

    const user = { username: customer.email, role: customer.createdBy };
    const accessToken = createJWT(user);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
};

/**
 * Fresh Token
 * @param {Request} req
 * @param {Response} res
 */
export const freshToken = (req, res) => {
  const { exp, role, username } = req.body;

  const user = { name: username, role };

  return bcrypt.sign(
    {
      exp: exp,
      data: user,
    },
    process.env.JWT_SECRET
  );
};

/**
 * Customer Registration
 * @param {Request} req
 * @param {Response} res
 */
export const registerCustomer = async (req, res) => {
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
    const data = prepareCustomerData({
      businessType: business_type,
      userDetails: {
        first_name,
        last_name,
        nic,
        brn,
        brFile: req.file ? req.file.path : null,
        contact,
        email,
        full_address,
        hashedPassword,
        role: roles.CUSTOMER,
        is_approved: false,
        createdBy,
      },
    });

    // Create a new customer object
    const customer = new Customer(data);
    const respond = await customer.save();

    const user = { username: data.email, role: data.role };
    const accessToken = createJWT(user);

    res.status(201).send({
      message: "Customer registered successfully.",
      data: respond,
      accessToken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
};
