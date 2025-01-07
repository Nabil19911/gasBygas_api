import bcrypt from "bcrypt";
import businessTypeConstant from "../constant/businessType.js";
import roles from "../constant/roles.js";
import { createJWT, registerCustomer } from "../helper/authHelper.js";
import {
  checkIfExists,
  prepareCustomerData,
} from "../helper/customerHelper.js";
import Employee from "../models/employee.model.js";
import Customer from "../models/customer.model.js";

/**
 * Employee Login
 * @param {Request} req
 * @param {Response} res
 */
export const employeeLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employee = await Employee.findOne({ username });
    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
    }

    const user = { username, role: employee.role };
    const accessToken = createJWT(user);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
};

/**
 * Customer Login
 * @param {Request} req
 * @param {Response} res
 */
export const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
    }

    const user = { username: customer.email, role: customer.createdBy };
    const accessToken = createJWT(user);

    res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
};

/**
 * Fresh Token
 * @param {Request} req
 * @param {Response} res
 */
export const freshToken = async (req, res) => {
  const { exp, role, username } = req.body;

  const user = { name: username, role };

  const freshToken = await bcrypt.sign(
    {
      exp: exp,
      data: user,
    },
    process.env.JWT_SECRET
  );

  res.status(200).send({ accessToken: freshToken });
};

/**
 * Customer Registration
 * @param {Request} req
 * @param {Response} res
 */
export const register = async (req, res) => {
  try {
    const { respond, accessToken } = await registerCustomer(req.body);

    res.status(201).send({
      message: "Customer registered successfully.",
      data: respond,
      accessToken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: `Server error. Please try again later: ${error.message}`,
    });
  }
};
