import bcrypt from "bcrypt";
import { createJWT, registerCustomer } from "../helper/authHelper.js";
import Employee from "../models/employee.model.js";
import User from "../models/user.model.js";

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
 * User Login
 * @param {Request} req
 * @param {Response} res
 */
export const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({
        message: "Invalid credentials. Please try again.",
      });
    }

    const userDetails = { username: user.email, role: user.created_by };
    const accessToken = createJWT(userDetails);

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
 * User Registration
 * @param {Request} req
 * @param {Response} res
 */
export const register = async (req, res) => {
  try {
    const { respond, accessToken } = await registerCustomer(req, res);

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
