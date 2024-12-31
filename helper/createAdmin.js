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
    username: 'admin',
    role: roles.ADMIN,
  });

  await admin.save();
  console.log("Admin Created:", admin);
};

export default createAdmin;
