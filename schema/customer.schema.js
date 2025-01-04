import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import schemaModels from "../constant/schemaModels.js";
import businessTypeConstant from "../constant/businessType.js";

const customerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Individual;
      },
    },
    last_name: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Individual;
      },
    },
    business_type: {
      type: String,
      enum: Object.values(businessTypeConstant),
      default: businessTypeConstant.Individual,
      required: true,
    },
    email: {
      type: String,
      required: function () {
        return "Email is required.";
      },
      unique: true,
    },
    nic: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Individual;
      },
    },
    brFile: {
      type: String, // Store the file data as binary
      required: function () {
        return this.businessType === businessTypeConstant.Organization;
      },
    },
    brn: {
      type: String,
      required: function () {
        return this.businessType === businessTypeConstant.Organization;
      },
    },
    contact: {
      type: String,
      required: true,
    },
    full_address: {
      district: {
        type: String,
        required: true,
      },
      post_code: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password and create username before saving
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to match password
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Customer = model(schemaModels.Customer, customerSchema);

export default Customer;
