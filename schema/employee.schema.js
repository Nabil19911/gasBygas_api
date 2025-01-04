import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import roles from "../constant/roles.js";
import schemaModels from "../constant/schemaModels.js";

const employeeSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: function () {
        return this.role !== roles.ADMIN;
      },
      validate: {
        validator: function (value) {
          return this.role === roles.ADMIN || value; // Email must exist unless admin
        },
        message: "Email is required.",
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.ADMIN,
    },
    outlet: {
      type: Schema.Types.ObjectId,
      ref: schemaModels.Outlet,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.pre("save", async function (next) {
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

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Employee = model(schemaModels.Employee, employeeSchema);

export default Employee;
