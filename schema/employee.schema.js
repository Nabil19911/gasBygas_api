import { Schema } from "mongoose";
import roles from "../constant/roles.js";
import schemaModels from "../constant/schemaModels.js";
import activeStatus from "../constant/activeStatus.js";

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
    status: {
      type: String,
      enum: Object.values(activeStatus),
      default: activeStatus.ACTIVE,
    },
    contact: {
      type: String,
      required: function () {
        return this.role !== roles.ADMIN;
      },
      validate: {
        validator: function (value) {
          return this.role === roles.ADMIN || value; // Email must exist unless admin
        },
        message: "Contact is required.",
      },
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
    is_temp_password_changed: {
      type: Boolean,
      default: false,
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
