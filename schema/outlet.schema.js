import mongoose from "mongoose";
import activeStatus from "../constant/activeStatus.js"; // Enum for active status
import { gasType } from "../constant/gasTypes.js";
import districts from "../constant/districts.js";

const { Schema } = mongoose;

const OutletSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(activeStatus),
      default: activeStatus.ACTIVE,
    },
    branch_code: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gas_request: {
      active_until: {
        type: Date,
        required: false,
      },
      is_allowed: {
        type: Boolean,
        required: false,
        default: false,
      },
      allowed_qty: {
        type: Number,
        required: false,
        default: 0,
      },
    },
    full_address: {
      district: {
        type: String,
        enum: Object.values(districts),
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
    cylinders_stock: [
      {
        type: {
          type: String,
          enum: Object.values(gasType),
          required: true,
        },
        currentStock: {
          type: Number,
          required: true,
          min: 0,
        },
        minimumThreshold: {
          type: Number,
          required: true,
          min: 0,
        },
        maximumCapacity: {
          type: Number,
          required: true,
          min: 0,
        },
        incomingStock: {
          type: Number,
          required: false,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default OutletSchema;
