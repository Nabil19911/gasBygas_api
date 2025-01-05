import Customer from "../models/customer.model.js";

/**
 * Get customer profile by email
 * @param {Request} req
 * @param {Response} res
 */
export const getCustomerProfile = async (req, res) => {
  const { email } = req.body;

  try {
    const customer = await Customer.findOne({ email });

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
    };

    res.status(200).json({ data: organizationData });
  } catch (error) {
    console.error("Error fetching customer profile: ", error.message);
    res.status(400).json({ error: `Error: ${error.message}` });
  }
};

/**
 * Example resource route
 * @param {Request} req
 * @param {Response} res
 */
export const getCustomers = (req, res) => {
  res.send("respond with a resource");
};
