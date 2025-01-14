import { model } from "mongoose";
import schemaModels from "../constant/schemaModels";
import OutletSchema from "../schema/outlet.schema";

const Outlet = model(schemaModels.Outlet, OutletSchema);

export default Outlet;
