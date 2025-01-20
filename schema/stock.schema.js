import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    currentStock: {
      type: Number,
      required: true,
    },
    outgoingStock: {
      type: Number,
      required: false,
    },
    minimumThreshold: {
      type: Number,
      required: true,
    },
    maximumCapacity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default stockSchema;
