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
      id: customer._id,
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
