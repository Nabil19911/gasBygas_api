import { model } from "mongoose";
import GasTypeSchema from "../schema/gasType.schema.js";
import schemaModels from "../constant/schemaModels.js";

const GasType = model(schemaModels.GasType, GasTypeSchema);

export default GasType;
