import { Schema } from "mongoose";
import { gasRequestType } from "../constant/gasRequestType.js";
import { gasType } from "../constant/gasTypes.js";
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
        default: requestStatus.PENDING
      },
      approvedBy: {
        type: String,
        required: false,
      },
      approvedDate: {
        type: Date,
        required: false,
      },
      approvedGas: [
        {
          type: {
            type: String,
            enum: Object.values(gasType),
            required: false,
          },
          requestType: {
            type: String,
            enum: Object.values(gasRequestType),
            default: gasRequestType.New_Gas,
            required: false,
          },
          gasQuantity: {
            type: Number,
            required: false,
          },
        },
      ],
      comment: {
        type: String,
        required: false,
      },
    },

    gas: [
      {
        type: {
          type: String,
          enum: Object.values(gasType),
          required: false,
        },
        cylinder: {
          returned: {
            type: Boolean,
            required: false,
            default: false,
          },
          cylinderQuantity: {
            type: Number,
            required: false,
          },
        },
        gasQuantity: {
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
