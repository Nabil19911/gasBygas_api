import { Schema } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import deliveryStatus from "../constant/deliveryStatus.js";
import requestStatus from "../constant/requestStatus.js";

const OutletGasRequestSchema = new Schema(
  {
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Schedule,
      required: true,
    },
    outletId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Outlet,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      required: false,
    },

    headOfficeApproval: {
      status: {
        type: String,
        enum: Object.values(requestStatus),
        required: false,
        default: requestStatus.PENDING,
      },
      approvedBy: {
        type: String,
        required: false,
      },
      approvedDate: {
        type: Date,
        required: false,
      },
      comment: {
        type: String,
        required: false,
      },
    },

    gas: [
      {
        type: {
          type: Schema.Types.ObjectId,
          ref: schemaModels.GasType,
          required: false,
        },
        gasQuantity: {
          type: Number,
          required: false,
        },
        approvedGasQuantity: {
          type: Number,
          required: false,
        },
      },
    ],
    comments: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default OutletGasRequestSchema;
