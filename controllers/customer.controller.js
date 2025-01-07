import Customer from "../models/customer.model.js";

/**
 * Get customer profile by email
 * @param {Request} req
 * @param {Response} res
 */
export const getCustomerProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const customer = await Customer.findOne({ email }).select("-password");

    if (!customer) {
      throw new Error("Customer not found");
    }

    const organizationData = {
      ...customer._doc,
      role: customer.createdBy,
      password: undefined,
    };

    res.status(200).send({ data: organizationData });
  } catch (error) {
    console.error("Error fetching customer profile: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Get All Customers
 * @param {Request} req
 * @param {Response} res
 */
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");

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
 * Create new customer
 * @param {Request} req
 * @param {Response} res
 */
export const createNewCustomer = async (req, res) => {
  try {
    console.log(res.body)
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
