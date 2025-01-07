import Employee from "../models/employee.model.js";

/**
 * Get employee profile by username
 * @param {Request} req
 * @param {Response} res
 */
export const getEmployeeProfile = async (req, res) => {
  const { username } = req.body;

  try {
    // Fetch the employee by username
    const employee = await Employee.findOne({ username });
    if (!employee) {
      throw new Error("Employee not found");
    }

    const userData = {
      first_name: employee.first_name,
      last_name: employee.last_name,
      username: employee.username,
      role: employee.role,
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
