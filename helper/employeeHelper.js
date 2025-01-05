import roles from "../constant/roles.js";
import Employee from "../models/employee.model.js";

export const createAdmin = async () => {
  const existingAdmin = await Employee.findOne({ role: roles.ADMIN });
  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const admin = new Employee({
    first_name: "admin",
    last_name: "admin",
    password: "Pa$$word",
    username: 'admin',
    role: roles.ADMIN,
  });

  await admin.save();
  console.log("Admin Created:", admin);
};
