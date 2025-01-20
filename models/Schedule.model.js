import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import ScheduledSchema from "../schema/schedule.shema.js";

const Scheduled = model(schemaModels.Schedule, ScheduledSchema);

export default Scheduled;
