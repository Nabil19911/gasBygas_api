import GasType from "../models/gasType.modal.js";

/**
 * get all gas types
 * @param {Request} req
 * @param {Response} res
 */
export const getAllGasTypes = async (req, res) => {
  try {
    const gasTypes = await GasType.find();
    if (gasTypes.length === 0) {
      return res.status(200).json({ data: [], message: "No gas types found" });
    }
    res.status(200).send({ data: gasTypes });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Get gas type by ID
 * @param {Request} req
 * @param {Response} res
 */
export const getGasTypeById = async (req, res) => {
  try {
    const gasType = await GasType.findById(req.params.id);
    if (!gasType) {
      return res.status(404).json({ message: "Gas type not found" });
    }
    res.status(200).send({ data: gasType });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Create a new gas type
 * @param {Request} req
 * @param {Response} res
 */
export const createGasType = async (req, res) => {
  try {
    const gasType = new GasType({
      name: req.body.name.toUpperCase(),
      description: req.body.description,
      cylinder_price: +req.body.cylinder_price,
      price: +req.body.price,
    });
    const newGasType = await gasType.save();
    res.status(201).send({ data: newGasType });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/**
 * Update a gas type
 * @param {Request} req
 * @param {Response} res
 */
export const updateGasType = async (req, res) => {
  try {
    const gasType = await GasType.findById(req.params.id);
    if (!gasType) {
      return res.status(404).send({ message: "Gas type not found" });
    }

    gasType.name = req.body.name || gasType.name;
    gasType.description = req.body.description || gasType.description;

    const updatedGasType = await gasType.save();
    res.status(200).send({ data: updatedGasType });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/**
 * Delete a gas type
 * @param {Request} req
 * @param {Response} res
 */
export const deleteGasType = async (req, res) => {
  try {
    const gasType = await GasType.findById(req.params.id);
    if (!gasType) {
      return res.status(404).send({ message: "Gas type not found" });
    }

    await gasType.remove();
    res.status(200).send({ message: "Gas type deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
