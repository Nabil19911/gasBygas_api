import businessTypeConstant from "../constant/businessType.js";
import requestStatus from "../constant/requestStatus.js";
import User from "../models/user.model.js";

export const checkIfExists = async ({ field, value, errorMessage }) => {
  const existingRecord = await User.findOne({ [field]: value });
  if (existingRecord) {
    throw new Error(errorMessage);
  }
};

export const prepareUserData = ({ businessType, userDetails }) => {
  const commonData = {
    business_type: businessType,
    contact: userDetails.contact,
    email: userDetails.email,
    full_address: userDetails.address,
    password: userDetails.hashedPassword,
    status: userDetails.status,
    created_by: userDetails.role,
    role: userDetails.role,
    business_registration_certification_path:
      userDetails.business_registration_certification_path,
  };

  const { organization, individual } = userDetails;

  if (businessType === businessTypeConstant.Organization) {
    return {
      ...commonData,
      organization_details: {
        ...organization,
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
