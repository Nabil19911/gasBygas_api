import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import IndividualGasRequestSchema from "../schema/individualGasRequest.schema.js";

const IndividualGasRequest = model(schemaModels.IndividualGasRequest, IndividualGasRequestSchema);

export default IndividualGasRequest;
