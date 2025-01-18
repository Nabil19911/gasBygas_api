import Outlet from "../models/outlet.model.js";

/**
 * Create new outlet
 * @param {Request} req
 * @param {Response} res
 */
export const createNewOutlet = async (req, res) => {
  try {
    const data = req.body;
    const outlet = await Outlet(data);
    const respond = await outlet.save();

    if (!outlet) {
      throw new Error("Outlet is not created");
    }

    res.status(201).send({ data: respond });
  } catch (error) {
    console.error("Error fetching Employees: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * Get All outlets
 * @param {Request} req
 * @param {Response} res
 */
export const getAllOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find();

    if (!outlets) {
      throw new Error("Customers are not found");
    }

    res.status(200).send({ data: outlets });
  } catch (error) {
    console.error("Error fetching customers: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};
