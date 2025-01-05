import { Schema } from "mongoose";
import businessTypeConstant from "../constant/businessType.js";

const CustomerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Individual;
      },
    },
    last_name: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Individual;
      },
    },
    business_type: {
      type: String,
      enum: Object.values(businessTypeConstant),
      default: businessTypeConstant.Individual,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    is_approved: {
      type: Boolean,
      required: function () {
        return this.businessType === businessTypeConstant.Organization;
      },
    },
    nic: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Individual;
      },
    },
    brFile: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Organization;
      },
    },
    brn: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Organization;
      },
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
    createdBy: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default CustomerSchema;
