import activeStatus from "../constant/activeStatus.js";
import businessTypeConstant from "../constant/businessType.js";
import districts from "../constant/districts.js";
import roles from "../constant/roles.js";
import { checkIfExists, prepareUserData } from "../helper/userHelper.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * Get user profile by email
 * @param {Request} req
 * @param {Response} res
 */
export const getUserProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const customer = await User.findOne({ email }).select("-password");

    // TODO: find the gas requested user

    if (!customer) {
      throw new Error("User not found");
    }

    const organizationData = {
      ...customer._doc,
      role: customer.created_by,
      password: undefined,
    };

    res.status(200).send({ data: organizationData });
  } catch (error) {
    console.error("Error fetching user profile: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * Get user profile by id
 * @param {Request} req
 * @param {Response} res
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await User.findById(id).select("-password");

    res.status(200).send({ data: customer });
  } catch (error) {
    console.error("Error fetching user profile: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * Get All users
 * @param {Request} req
 * @param {Response} res
 */
export const getAllUsers = async (req, res) => {
  try {
    const customers = await User.find().select("-password");

    if (!customers) {
      throw new Error("Customers are not found");
    }

    res.status(200).send({ data: customers });
  } catch (error) {
    console.error("Error fetching customers: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * Create new user
 * @param {Request} req
 * @param {Response} res
 */
export const createNewUser = async (req, res) => {
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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

    // const user = { username: data.email, role: data.role };
    // const accessToken = createJWT(user);

    res.status(201).send({
      message: "Customer registered successfully.",
      data: respond,
      // accessToken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
};

/**
 * update user profile by id
 * @param {Request} req
 * @param {Response} res
 */
export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    // Find and update user by id
    const customer = await User.findByIdAndUpdate(id, data, { new: true });

    if (!customer) {
      return res.status(404).send({ message: "User not found" });
    }

    // Send back the updated user profile as response
    res.status(200).send({ data: customer });
  } catch (error) {
    console.error("Error updating user profile: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * update user by email
 * @param {Request} req
 * @param {Response} res
 */
export const getUserByEmail = async (req, res) => {
  const data = req.body;
  try {
    // Find and update user by id
    const customer = await User.findOne(data);

    if (!customer) {
      return res.status(404).send({ message: "User not found" });
    }

    // Send back the updated user profile as response
    res.status(200).send({ data: customer });
  } catch (error) {
    console.error("Error updating user profile: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};
