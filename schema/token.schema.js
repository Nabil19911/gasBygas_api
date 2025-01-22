import mongoose from "mongoose";
import requestStatus from "../constant/requestStatus.js";

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(requestStatus),
      default: requestStatus.PENDING,
      required: true,
    },
  },
  { timestamps: true }
);

export default tokenSchema;
