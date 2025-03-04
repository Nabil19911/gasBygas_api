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
    console.error("Error creating new outlet: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * Get All outlets
 * @param {Request} req
 * @param {Response} res
 */
export const getAllOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find().populate("cylinders_stock.type");

    if (!outlets) {
      throw new Error("Outlets are not found");
    }

    res.status(200).send({ data: outlets });
  } catch (error) {
    console.error("Error fetching all Outlets: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * Get outlet by id
 * @param {Request} req
 * @param {Response} res
 */
export const getOutletById = async (req, res) => {
  try {
    const { id } = req.params;

    const outlet = await Outlet.findById(id).populate("cylinders_stock.type");

    if (!outlet) {
      throw new Error("Outlet is not found");
    }

    res.status(200).send({ data: outlet });
  } catch (error) {
    console.error("Error fetching Outlet by id: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * patch outlets
 * @param {Request} req
 * @param {Response} res
 */
export const updateOutlet = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const outlets = await Outlet.findByIdAndUpdate(id, data, { new: true });
    if (!outlets) {
      throw new Error("Outlet didn't updated");
    }

    res.status(200).send({ data: outlets });
  } catch (error) {
    console.error("Error patching Outlet: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * request new gas
 * @param {Request} req
 * @param {Response} res
 */
export const requestNewGas = async (req, res) => {
  try {
    const data = req.body;
    const gasRequest = await OutletGasRequest(data);
    await gasRequest.save();

    if (!gasRequest) {
      throw new Error("gas request is not made");
    }

    res.status(200).send({ data: gasRequest });
  } catch (error) {
    console.error("Error creating new gas request: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * get outlet gas requests by id
 * @param {Request} req
 * @param {Response} res
 */
export const getOutletGasRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const gasRequest = await OutletGasRequest.find({ outletId: id }).populate(
      "scheduleId"
    );

    if (!gasRequest) {
      throw new Error("gas request is not found");
    }

    res.status(200).send({ data: gasRequest });
  } catch (error) {
    console.error("Error fetching outlet gas requests by id: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * get all request gas
 * @param {Request} req
 * @param {Response} res
 */
export const getAllOutletGasRequests = async (req, res) => {
  try {
    const gasRequest = await OutletGasRequest.find()
      .populate("scheduleId")
      .populate("outletId");

    if (!gasRequest) {
      throw new Error("gas requests are not found");
    }

    res.status(200).send({ data: gasRequest });
  } catch (error) {
    console.error("Error fetching all gas requests: ", error.message);
    res.status(400).send({ message: error.message });
  }
};
