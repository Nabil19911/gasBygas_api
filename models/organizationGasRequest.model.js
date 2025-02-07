import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import OrganizationGasRequestSchema from "../schema/organizationGasRequest.schema.js";

const OrganizationGasRequest = model(
  schemaModels.OrganizationGasRequest,
  OrganizationGasRequestSchema
);

export default OrganizationGasRequest;
