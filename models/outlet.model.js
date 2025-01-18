import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import OutletSchema from "../schema/outlet.schema.js";

const Outlet = model(schemaModels.Outlet, OutletSchema);

export default Outlet;
