import { model } from "mongoose";
import bcrypt from "bcryptjs";
import CustomerSchema from "../schema/customer.schema.js";
import schemaModels from "../constant/schemaModels.js";

// Middleware to hash the password before saving
CustomerSchema.pre("save", async function (next) {
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
CustomerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const Customer = model(schemaModels.Customer, CustomerSchema);

export default Customer;
