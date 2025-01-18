import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { checkIfExists, prepareCustomerData } from "./customerHelper.js";
import activeStatus from "../constant/activeStatus.js";
import businessTypeConstant from "../constant/businessType.js";
import roles from "../constant/roles.js";

export const createJWT = (data) => {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      sub: data.username,
      role: data.role,
    },
    process.env.JWT_SECRET
  );
};

export const registerCustomer = async (req, res) => {
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
  const data = prepareCustomerData({
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
      business_registration_certification_path: req.file ? req.file.path : null,
    },
  });

  // Create a new customer object
  const customer = new User(data);
  const respond = await customer.save();

  const user = { username: data.email, role: data.role };
  const accessToken = createJWT(user);

  return {
    respond,
    accessToken,
  };
};
