import bcrypt from "bcrypt";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { generateToken, mailer } from "../helper/generalHelper.js";
import Employee from "../models/employee.model.js";
import schemaModels from "../constant/schemaModels.js";

/**
 * Get employee profile by username
 * @param {Request} req
 * @param {Response} res
 */
export const getEmployeeProfile = async (req, res) => {
  const { username } = req.body;

  try {
    // Fetch the employee by username
    const employee = await Employee.findOne({ username }).populate({
      path: "outlet",
      populate: {
        path: "cylinders_stock",
        populate: {
          path: "type",
          model: schemaModels.GasType,
        },
      },
    });
    if (!employee) {
      throw new Error("Employee not found");
    }

    const userData = {
      _id: employee._id,
      email: employee.email,
      contact: employee.contact,
      first_name: employee.first_name,
      last_name: employee.last_name,
      username: employee.username,
      role: employee.role,
      outlet: employee.outlet,
    };

    res.status(200).send({ data: userData });
  } catch (error) {
    console.error("Something went wrong:", error.message);
    res.status(401).send({ message: `Something went wrong: ${error.message}` });
  }
};

/**
 * Get All Employees
 * @param {Request} req
 * @param {Response} res
 */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");

    if (!employees) {
      throw new Error("Employees are not found");
    }

    res.status(200).send({ data: employees });
  } catch (error) {
    console.error("Error fetching Employees: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Get Employee by email - View Employee
 * @param {Request} req
 * @param {Response} res
 */
export const getEmployeeByEmail = async (req, res) => {
  try {
    const email = req.body;
    const employees = await Employee.find(email).select("-password");

    if (!employees) {
      throw new Error("Employee is not found");
    }

    res.status(200).send({ data: employees });
  } catch (error) {
    console.error("Error fetching Employees: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Get create new Employee
 * @param {Request} req
 * @param {Response} res
 */
export const createNewEmployee = async (req, res) => {
  try {
    const { first_name, last_name, role, status, email, contact, outlet } =
      req.body;

    const existingRecord = await Employee.findOne({ email });

    if (existingRecord) {
      throw new Error("Email already taken");
    }

    const saltRounds = 10;
    const generatePassword = generateToken(10);
    const hashedPassword = await bcrypt.hash(generatePassword, saltRounds);

    const data = {
      first_name,
      last_name,
      role,
      status,
      email,
      contact,
      outlet,
      password: hashedPassword,
      username: email,
    };

    const employee = await Employee(data);
    const respond = await employee.save();

    if (!employee) {
      throw new Error("Employee is not created");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(
      __dirname,
      "..",
      "emailTemplates",
      "employeeRegister.ejs"
    );
    const emailHtml = await ejs.renderFile(templatePath, {
      password: generatePassword,
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Welcome to the Team!",
      html: emailHtml,
    };

    const transporter = await mailer(mailOptions);
    const emailRespond = await transporter.sendMail(mailOptions);

    res
      .status(201)
      .send({ data: { password: generatePassword, respond, emailRespond } });
  } catch (error) {
    console.error("Error fetching Employees: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * Update Employee by email
 * @param {Request} req
 * @param {Response} res
 */
export const updateEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employee = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!employee) {
      throw new Error("Employee not found");
    }

    res.status(200).send({ data: employee });
  } catch (error) {
    console.error("Error updating employee: ", error.message);
    res.status(400).send({ message: error.message });
  }
};
