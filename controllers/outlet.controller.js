import Outlet from "../models/outlet.model.js";
import OutletGasRequest from "../models/outletGasRequest.model.js";

/**
 * Create new outlet
 * @param {Request} req
 * @param {Response} res
 */
export const createNewOutlet = async (req, res) => {
  try {
    const data = req.body;
    const existingOutletByEmail = await Outlet.findOne({ email: data.email });
    const existingOutletByBranchCode = await Outlet.findOne({
      branch_code: data.branch_code,
    });

    if (existingOutletByEmail || existingOutletByBranchCode) {
      throw new Error("Outlet is already exist with same email or branch code");
    }

    const outlet = await Outlet(data);
    const respond = await outlet.save();

    if (!outlet) {
      throw new Error("Outlet is not created");
    }

    res.status(201).send({ data: respond });
  } catch (error) {
    console.error("Error fetching Employees: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
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
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * request gas
 * @param {Request} req
 * @param {Response} res
 */
export const requestGas = async (req, res) => {
  try {
    const data = req.body;
    const gasRequest = await OutletGasRequest(data);
    await gasRequest.save();

    if (!gasRequest) {
      throw new Error("Customers are not found");
    }

    res.status(200).send({ data: gasRequest });
  } catch (error) {
    console.error("Error fetching customers: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * get request gas
 * @param {Request} req
 * @param {Response} res
 */
export const getOutletGasRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const gasRequest = await OutletGasRequest.find({ outletId: id }).populate('scheduleId');

    if (!gasRequest) {
      throw new Error("Customers are not found");
    }

    res.status(200).send({ data: gasRequest });
  } catch (error) {
    console.error("Error fetching customers: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};