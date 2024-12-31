import { Schema } from "mongoose";
import schemaModels from "../constant/schemaModels.js";

const outletSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Outlet = mongoose.model(schemaModels.Outlet, outletSchema);
export default Outlet;
