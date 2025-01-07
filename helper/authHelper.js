import jwt from "jsonwebtoken";
import { checkIfExists, prepareCustomerData } from "./customerHelper.js";
import Customer from "../models/customer.model.js";

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

export const registerCustomer = async (body) => {
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
  } = body;

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
  const hashedPassword = await bcrypt.hash(password ?? "0000", saltRounds);

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

  return {
    respond,
    accessToken,
  };
};
