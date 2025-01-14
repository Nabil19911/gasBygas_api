import Outlet from "../models/outlet.model";

/**
 * Create new outlet
 * @param {Request} req
 * @param {Response} res
 */
export const createNewOutlet = async (req, res) => {
  try {
    const data = req.body;
    const outlet = await Outlet(data);
    const res = await outlet.save();

    if (!employees) {
      throw new Error("Outlet is not created");
    }

    res.status(201).send({ data: res });
  } catch (error) {
    console.error("Error fetching Employees: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};
