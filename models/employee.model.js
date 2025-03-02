import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import EmployeeSchema from "../schema/employee.schema.js";

// Create and export the Employee model
const Employee = model(schemaModels.Employee, EmployeeSchema);

export default Employee;
