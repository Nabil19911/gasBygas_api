import { Schema } from "mongoose";
import { gasRequestType } from "../constant/gasRequestType.js";
import { gasType } from "../constant/gasTypes.js";
import { paymentMethod } from "../constant/paymentMethod.js";
import { paymentStatus } from "../constant/paymentStatus.js";
import requestStatus from "../constant/requestStatus.js";
import roles from "../constant/roles.js";
import schemaModels from "../constant/schemaModels.js";

const GasRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.User,
      required: true,
    },
    outletId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Outlet,
      required: true,
    },
    tokenId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Token,
      required: true,
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Schedule,
      required: true,
    },
    gas: {
      individual: {
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
        isCylinderReturned: {
          type: Boolean,
          required: false,
          default: false,
        },
        gasQuantity: {
          type: Number,
          required: false,
        },
        reallocateGasRequest: {
          is_reallocated: {
            type: Boolean,
            required: false,
          },
          toSheduleId: {
            type: Schema.Types.ObjectId,
            ref: schemaModels.Schedule,
            required: false,
          },
          comments: {
            type: String,
            required: false,
          },
        },
      },
      organization: [
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
          isCylinderReturned: {
            type: Boolean,
            required: false,
            default: false,
          },
          gasQuantity: {
            type: Number,
            required: false,
          },
        },
      ],
    },

    payment: {
      status: {
        type: String,
        enum: Object.values(paymentStatus),
        default: paymentStatus.PENDING,
        required: false,
      },
      totalAmount: {
        type: Number,
        required: false,
      },
      method: {
        type: String,
        enum: Object.values(paymentMethod),
        required: false,
      },
      paymentDate: {
        type: Date,
        required: false,
      },
    },

    headOfficeApproval: {
      status: {
        type: String,
        enum: Object.values(requestStatus),
        required: false,
      },
      approvedBy: {
        type: String,
        required: false,
      },
      date: {
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

    comments: {
      type: String,
      required: false,
    },

    createdBy: {
      type: String,
      enum: Object.values(roles),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default GasRequestSchema;
