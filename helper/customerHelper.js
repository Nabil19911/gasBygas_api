import businessTypeConstant from "../constant/businessType.js";
import requestStatus from "../constant/requestStatus.js";
import Customer from "../models/customer.model.js";

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
    full_address: userDetails.address,
    password: userDetails.hashedPassword,
    status: userDetails.status,
    created_by: userDetails.role,
    role: userDetails.role,
  };

  const { organization, individual } = userDetails;

  if (businessType === businessTypeConstant.Organization) {
    return {
      ...commonData,
      organization_details: {
        ...organization,
        business_registration_certification_path:
          userDetails.business_registration_certification_path,
        approval_status: requestStatus.PENDING,
      },
    };
  }

  return {
    ...commonData,
    individual_details: {
      first_name: individual.first_name,
      last_name: individual.last_name,
      nic: individual.nic,
    },
  };
};
