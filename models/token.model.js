import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import tokenSchema from "../schema/token.schema.js";

const Token = model(schemaModels.Token, tokenSchema);

export default Token;
