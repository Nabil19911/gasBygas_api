import { Schema } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import activeStatus from "../constant/activeStatus.js";

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
    contant: {
      type: String,
    },
    location: {
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
  },
  {
    timestamps: true,
  }
);

export default OutletSchema;
