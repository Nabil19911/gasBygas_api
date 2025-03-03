import { Schema } from "mongoose";
import schemaModels from "../constant/schemaModels.js";

const stockSchema = new Schema(
  {
    stock: [
      {
        currentStock: {
          type: Number,
          required: true,
        },
        gasType: {
          type: Schema.Types.ObjectId,
          ref: schemaModels.GasType,
          required: false,
        },
        reservedStock: {
          type: Number,
          required: false,
        },
        minimumThreshold: {
          type: Number,
          required: false,
        },
        maximumCapacity: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default stockSchema;
