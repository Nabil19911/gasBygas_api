import mongoose from "mongoose";
import activeStatus from "../constant/activeStatus.js"; // Enum for active status
import { gasType } from "../constant/gasTypes.js";

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
    // is_request_enable: {
    //   type: Boolean,
    //   default: false,
    //   required: false,
    // },
    // tokenThreshold: {

    // },
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
    stock: {
      cylinders: [
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
          incomingStock:{
            type: Number,
            required: true,
            min: 0,
          }
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default OutletSchema;
