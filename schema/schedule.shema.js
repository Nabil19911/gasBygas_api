import { Schema } from "mongoose";
import deliveryStatus from "../constant/deliveryStatus.js";
import { gasType } from "../constant/gasTypes.js";
import schemaModels from "../constant/schemaModels.js";

const ScheduledSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      required: false,
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
    comment: {
      type: String,
      required: false,
    },
    outlets: [
      {
        outletId: {
          type: Schema.Types.ObjectId,
          ref: schemaModels.Outlet,
        },
        gas: [
          {
            type: {
              type: String,
              enum: Object.values(gasType),
              required: true,
            },
            gasQuantity: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default ScheduledSchema;
