import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import stockSchema from "../schema/stock.schema.js";

// Create and export the model
const Stock = model(schemaModels.Stock, stockSchema);

export default Stock;
