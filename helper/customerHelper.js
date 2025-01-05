import businessTypeConstant from "../constant/businessType.js";
import roles from "../constant/roles.js";
import Customer from "../schema/customer.schema.js";

export const checkIfExists = async ({ field, value, errorMessage }) => {
  const existingRecord = await Customer.findOne({ [field]: value });
  if (existingRecord) {
    throw new Error(errorMessage);
  }
};

export const prepareCustomerData = ({ businessType, userDetails }) => {
  const commonData = {
    business_type: businessType,
    contact: userDetails.contact,
    email: userDetails.email,
    full_address: JSON.parse(userDetails.full_address),
    password: userDetails.hashedPassword,
    createdBy: userDetails.role,
  };

  if (businessType === businessTypeConstant.Organization) {
    return {
      ...commonData,
      brFile: userDetails.brFile,
      brn: userDetails.brn,
      is_approved: userDetails.is_approved,
    };
  }

  return {
    ...commonData,
    first_name: userDetails.first_name,
    last_name: userDetails.last_name,
    nic: userDetails.nic,
  };
};
