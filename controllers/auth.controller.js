import bcrypt from "bcrypt";
import { createJWT } from "../helper/authHelper.js";
import Employee from "../models/employee.model.js";
import User from "../models/user.model.js";
import { checkIfExists, prepareUserData } from "../helper/userHelper.js";
import roles from "../constant/roles.js";
import activeStatus from "../constant/activeStatus.js";
import businessTypeConstant from "../constant/businessType.js";

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
 * User Login
 * @param {Request} req
 * @param {Response} res
 */
export const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
    }

    const userDetails = { username: user.email, role: user.created_by };
    const accessToken = createJWT(userDetails);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
};

/**
 * Fresh Token
 * @param {Request} req
 * @param {Response} res
 */
export const freshToken = async (req, res) => {
  const { exp, role, username } = req.body;

  const user = { name: username, role };

  const freshToken = await bcrypt.sign(
    {
      exp: exp,
      data: user,
    },
    process.env.JWT_SECRET
  );

  res.status(200).send({ accessToken: freshToken });
};

/**
 * User Registration
 * @param {Request} req
 * @param {Response} res
 */
export const register = async (req, res) => {
  try {
    const {
      organization_details,
      individual_details,
      business_type,
      contact,
      email,
      full_address,
      password,
    } = req.body;

    const organization = organization_details
      ? JSON.parse(organization_details)
      : {};
    const individual = individual_details ? JSON.parse(individual_details) : {};
    const address = JSON.parse(full_address);

    //  check email is already exists
    await checkIfExists({
      field: "email",
      value: email,
      errorMessage: "Email already in use.",
    });

    // For 'Individual' business type, check NIC uniqueness
    if (business_type === businessTypeConstant.Individual) {
      await checkIfExists({
        field: "nic",
        value: individual.nic,
        errorMessage: "NIC already registered.",
      });
    }

    // For 'Organization', check BRN uniqueness and validate file upload
    if (business_type === businessTypeConstant.Organization) {
      await checkIfExists({
        field: "business_registration_number",
        value: organization.business_registration_number,
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
    const hashedPassword = await bcrypt.hash(password ?? "0000", saltRounds);

    // Prepare the data to be saved
    const data = prepareUserData({
      businessType: business_type,
      userDetails: {
        organization,
        individual,
        contact,
        email,
        address,
        hashedPassword,
        role: roles.CUSTOMER,
        status: activeStatus.ACTIVE,
        business_registration_certification_path: req.file
          ? req.file.path
          : null,
      },
    });

    // Create a new customer object
    const customer = new User(data);
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
      message: error.message,
    });
  }
};
