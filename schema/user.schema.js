import { Schema } from "mongoose";
import roles from "../constant/roles.js";
import activeStatus from "../constant/activeStatus.js";
import businessTypeConstant from "../constant/businessType.js";
import requestStatus from "../constant/requestStatus.js";

const UserSchema = new Schema(
  {
    business_type: {
      type: String,
      enum: Object.values(businessTypeConstant),
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_temp_password_changed: {
      type: Boolean,
      default: false,
    },
    contact: {
      type: String,
      required: true,
    },
    full_address: {
      district: {
        type: String,
        required: true,
      },
      post_code: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: Object.values(activeStatus),
      default: activeStatus.ACTIVE,
      required: false,
    },
    created_by: {
      type: String,
      enum: Object.values(roles),
      required: true,
    },
    individual_details: {
      first_name: {
        type: String,
        required: function () {
          return this.business_type === businessTypeConstant.Individual;
        },
      },
      last_name: {
        type: String,
        required: function () {
          return this.business_type === businessTypeConstant.Individual;
        },
      },
      nic: {
        type: String,
        required: function () {
          return this.business_type === businessTypeConstant.Individual;
        },
      },
    },
    business_registration_certification_path: {
      type: String,
      required: function () {
        return this.business_type === businessTypeConstant.Organization;
      },
    },
    organization_details: {
      business_registration_number: {
        type: String,
        required: function () {
          return this.business_type === businessTypeConstant.Organization;
        },
      },
      business_name: {
        type: String,
        required: function () {
          return this.business_type === businessTypeConstant.Organization;
        },
      },
      approval_status: {
        type: String,
        enum: Object.values(requestStatus),
        default: requestStatus.PENDING,
      },
      approval_date: {
        type: Date,
        required: false,
      },
    },
  },
  { timestamps: true }
);

export default UserSchema;
