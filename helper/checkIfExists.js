import Customer from "../schema/customer.schema.js";

const checkIfExists = async (field, value, errorMessage) => {
  const existingRecord = await Customer.findOne({ [field]: value });
  if (existingRecord) {
    throw new Error(errorMessage);
  }
};

export default checkIfExists;
