import { Schema } from "mongoose";

const GasRequestSchema = new Schema(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.GasRequest,
    },
    reassignedBy: {
      type: String,
      required: false,
    },
    fromSchedule: {
      type: String,
      required: false,
    },
    toSchedule: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: false,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default GasRequestSchema;
