import { Schema } from "mongoose";
import deliveryStatus from "../constant/deliveryStatus.js";
import { paymentMethod } from "../constant/paymentMethod.js";
import { paymentStatus } from "../constant/paymentStatus.js";
import requestStatus from "../constant/requestStatus.js";
import roles from "../constant/roles.js";
import schemaModels from "../constant/schemaModels.js";

const OrganizationGasRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.User,
      required: true,
    },
    tokenId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Token,
      required: false,
    },

    deliveryDate: {
      type: Date,
      required: false,
    },

    gas: [
      {
        type: {
          type: Schema.Types.ObjectId,
          ref: schemaModels.GasType,
          required: false,
        },
        gasRefillRequests: {
          gasQuantity: {
            type: Number,
            required: false,
            default: 0,
          },
          approvedQuantity: {
            type: Number,
            required: false,
            default: 0,
          },
        },
        gasNewRequests: {
          gasQuantity: {
            type: Number,
            required: false,
            default: 0,
          },
          approvedQuantity: {
            type: Number,
            required: false,
            default: 0,
          },
          isCylinderReturned: {
            type: Boolean,
            required: false,
            default: false,
          },
          cylinderReturnedCount: {
            type: Number,
            required: false,
          },
        },
      },
    ],

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
        default: requestStatus.PENDING,
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

    status: {
      type: String,
      enum: Object.values(deliveryStatus),
      default: deliveryStatus.Pending,
      required: false,
    },
    
    comment: {
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

export default OrganizationGasRequestSchema;
