import mongoose from "mongoose";
import requestStatus from "../constant/requestStatus.js";
import activeStatus from "../constant/activeStatus.js";

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
      enum: Object.values(activeStatus),
      default: activeStatus.ACTIVE,
      required: true,
    },
  },
  { timestamps: true }
);

export default tokenSchema;
