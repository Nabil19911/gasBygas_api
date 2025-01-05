import bcrypt from "bcryptjs";
import { model } from "mongoose";
import schemaModels from "../constant/schemaModels.js";
import EmployeeSchema from "../schema/employee.schema.js";

// Middleware to hash the password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare passwords
EmployeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the Employee model
const Employee = model(schemaModels.Employee, EmployeeSchema);

export default Employee;
