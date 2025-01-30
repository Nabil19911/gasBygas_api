import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import OutletGasRequestSchema from "../schema/outletGasRequest.schema.js";

const GasRequest = model(schemaModels.OutletGasRequest, OutletGasRequestSchema);

export default GasRequest;
