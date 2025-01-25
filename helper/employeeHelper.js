import { gasType } from "../constant/gasTypes.js";
import roles from "../constant/roles.js";
import Employee from "../models/employee.model.js";
import Stock from "../models/stock.model.js";
import bcrypt from "bcrypt";

export const initializeAdmin = async () => {
  const existingAdmin = await Employee.findOne({ role: roles.ADMIN });
  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

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
  console.log("Admin Created:", { admin });
};

export const initializeStock = async () => {
  try {
    const existingStock = await Stock.find();

    if (existingStock.length > 0) {
      console.log("Stock is already initialized.");
      return;
    }

    const stockData = [
      {
        currentStock: 0,
        gasType: gasType.LARGE,
        reservedStock: 0,
        minimumThreshold: 0,
        maximumCapacity: 0,
      },
      {
        currentStock: 0,
        gasType: gasType.MEDIUM,
        reservedStock: 0,
        minimumThreshold: 0,
        maximumCapacity: 0,
      },
      {
        currentStock: 0,
        gasType: gasType.SMALL,
        reservedStock: 0,
        minimumThreshold: 0,
        maximumCapacity: 0,
      },
      {
        currentStock: 0,
        gasType: gasType.MINI,
        reservedStock: 0,
        minimumThreshold: 0,
        maximumCapacity: 0,
      },
    ];

    const stock = new Stock({
      stock: stockData,
    });

    await stock.save();
    console.log("Stock initialized successfully:", { stock });
  } catch (error) {
    console.error("Error initializing stock:", error.message);
  }
};
