import mongoose from "mongoose";
import { gasType } from "../constant/gasTypes.js";

const stockSchema = new mongoose.Schema(
  {
    stock: [
      {
        currentStock: {
          type: Number,
          required: true,
        },
        gasType: {
          type: String,
          enum: Object.values(gasType),
          required: false,
        },
        reservedStock: {
          type: Number,
          required: false,
        },
        minimumThreshold: {
          type: Number,
          required: false,
        },
        maximumCapacity: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default stockSchema;
