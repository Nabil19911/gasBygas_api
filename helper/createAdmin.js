import roles from "../constant/roles.js";
import User from "../schema/user.schema.js";

const createAdmin = async () => {
  const existingAdmin = await User.findOne({ role: roles.ADMIN });
  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const admin = new User({
    first_name: "admin",
    last_name: "admin",
    password: "Pa$$word",
    role: roles.ADMIN, // Admin role
  });

  await admin.save();
  console.log("Admin Created:", admin);
};

export default createAdmin;
