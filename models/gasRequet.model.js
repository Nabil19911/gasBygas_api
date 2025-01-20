import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import GasRequestSchema from "../schema/gasRequest.schema.js";

const GasRequest = model(schemaModels.GasRequest, GasRequestSchema);

export default GasRequest;
