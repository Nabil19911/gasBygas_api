import User from "../models/user.model.js";

/**
 * Get user profile by email
 * @param {Request} req
 * @param {Response} res
 */
export const getUserProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const customer = await User.findOne({ email }).select("-password");

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
    res.status(400).send({ error: `Error: ${error.message}` });
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
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Create new user
 * @param {Request} req
 * @param {Response} res
 */
export const createNewUser = async (req, res) => {
  try {
    console.log(res.body);
    // const customers = await Customer.find({}).select("-password");

    // if (!customers) {
    //   throw new Error("Customers are not found");
    // }

    // res.status(200).send({ data: customers });
  } catch (error) {
    console.error("Error creating customers: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};
