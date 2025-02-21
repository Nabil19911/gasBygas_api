import { Schema } from "mongoose";
import deliveryStatus from "../constant/deliveryStatus.js";
import districts from "../constant/districts.js";

const ScheduledSchema = new Schema(
  {
    deliveryDate: {
      type: Date,
      required: true,
    },
    outForDeliveryTime: {
      type: Date,
      required: false,
    },
    district: {
      type: String,
      enum: Object.values(districts),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default ScheduledSchema;
