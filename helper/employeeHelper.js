import roles from "../constant/roles.js";
import Employee from "../models/employee.model.js";
import Stock from "../models/stock.model.js";
import bcrypt from "bcrypt";

export const initializeAdminAndStock = async () => {
  const existingAdmin = await Employee.findOne({ role: roles.ADMIN });
  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const existingStock = await Stock.find();
  if (existingStock) {
    console.log("Stock is already exists.");
    return;
  }

  const stock = new Stock({
    currentStock: 0,
    outgoingStock: 0,
    minimumThreshold: 0,
    maximumCapacity: 0,
  });

  await stock.save();

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("Pa$$word", saltRounds);

  const admin = new Employee({
    first_name: "admin",
    last_name: "admin",
    password: hashedPassword,
    username: "admin",
    role: roles.ADMIN,
  });

  await admin.save();
  console.log("Admin and stock Created:", { admin, stock });
};
