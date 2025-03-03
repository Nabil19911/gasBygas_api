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
    res.status(200).json({ data: gasTypes });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json(gasType);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      price: +req.body.price,
    });
    const newGasType = await gasType.save();
    res.status(201).json(newGasType);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      return res.status(404).json({ message: "Gas type not found" });
    }

    gasType.name = req.body.name || gasType.name;
    gasType.description = req.body.description || gasType.description;

    const updatedGasType = await gasType.save();
    res.status(200).json(updatedGasType);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      return res.status(404).json({ message: "Gas type not found" });
    }

    await gasType.remove();
    res.status(200).json({ message: "Gas type deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
