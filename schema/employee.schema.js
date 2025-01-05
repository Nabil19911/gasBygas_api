import { Schema } from "mongoose";
import roles from "../constant/roles.js";
import schemaModels from "../constant/schemaModels.js";

const EmployeeSchema = new Schema(
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
      required: true,
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

export default EmployeeSchema;
