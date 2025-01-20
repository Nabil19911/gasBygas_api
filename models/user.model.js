import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import UserSchema from "../schema/user.schema.js";

// Create and export the model
const User = model(schemaModels.User, UserSchema);

export default User;
