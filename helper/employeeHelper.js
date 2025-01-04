import roles from "../constant/roles.js";
import Employee from "../schema/employee.schema.js";

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
