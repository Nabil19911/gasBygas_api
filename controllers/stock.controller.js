import Stock from "../models/stock.model.js";

/**
 * get Stock
 * @param {Request} req
 * @param {Response} res
 */
export const getStock = async (req, res) => {
  try {
    // Find the first stock document
    const stock = await Stock.findOne();

    if (!stock) {
      throw new Error("Stock not found");
    }

    // Send the stock data in response
    res.status(200).send({ data: stock });
  } catch (error) {
    console.error("Error getting stock: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};

/**
 * update Stock
 * @param {Request} req
 * @param {Response} res
 */
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      throw new Error("Stock ID is required");
    }

    const stock = await Stock.findByIdAndUpdate(id, updateData, { new: true });

    if (!stock) {
      throw new Error("Stock not found");
    }

    res.status(200).send({ data: stock });
  } catch (error) {
    console.error("Error updating stock: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};
