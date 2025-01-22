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
      required: false,
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
          required: true,
        },
        requestType: {
          type: String,
          enum: Object.values(gasRequestType),
          default: gasRequestType.New_Gas,
          required: true,
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
          required: true,
        },
        comments: {
          type: String,
          required: false,
        },
      },
      organization: [
        {
          type: {
            type: String,
            enum: Object.values(gasType),
            required: true,
          },
          requestType: {
            type: String,
            enum: Object.values(gasRequestType),
            default: gasRequestType.New_Gas,
            required: true,
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
            required: true,
          },
          comments: {
            type: String,
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
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      method: {
        type: String,
        enum: Object.values(paymentMethod),
        required: true,
      },
      paymentDate: {
        type: Date,
        required: true,
      },
    },

    outletManagerApproval: {
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
      type: {
        type: String,
        enum: Object.values(roles),
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default GasRequestSchema;
