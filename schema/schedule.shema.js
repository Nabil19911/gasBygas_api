import { Schema } from "mongoose";
import schemaModels from "../constant/schemaModels";

const ScheduledSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(requestStatus),
      required: false,
    },
    deliveryDate: {
      type: Date,
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

