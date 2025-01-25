import { getValidNumber } from "../helper/stockHelper.js";
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
    res.status(400).send({ message: `Error: ${error.message}` });
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
    const { stock } = req.body;

    if (!id) throw new Error("Stock ID is required");
    if (!stock || !Array.isArray(stock)) {
      throw new Error("Stock updates must be provided as an array");
    }

    const updateOperations = [];

    // Process each update item
    for (const [_, update] of stock.entries()) {
      const { gasType, currentStock, maximumCapacity, minimumThreshold } =
        update;

      if (!gasType) throw new Error("Gas type is required for each update");

      const updates = {};

      // Current Stock: Use $inc for increments
      if (currentStock !== undefined) {
        updates.currentStock = getValidNumber(currentStock, "Current Stock");
      }

      // Other fields: Use $set
      if (maximumCapacity !== undefined) {
        updates.maximumCapacity = getValidNumber(
          maximumCapacity,
          "Maximum Capacity"
        );
      }

      if (minimumThreshold !== undefined) {
        updates.minimumThreshold = getValidNumber(
          minimumThreshold,
          "Minimum Threshold"
        );
      }

      // Build operations
      if (Object.keys(updates).length > 0) {
        updateOperations.push({
          updateOne: {
            filter: { _id: id, "stock.gasType": gasType },
            update: {
              $inc: { [`stock.$.currentStock`]: updates.currentStock || 0 },
              $set: {
                ...(updates.maximumCapacity !== undefined && {
                  "stock.$.maximumCapacity": updates.maximumCapacity,
                }),
                ...(updates.minimumThreshold !== undefined && {
                  "stock.$.minimumThreshold": updates.minimumThreshold,
                }),
              },
            },
          },
        });
      }
    }

    // Execute all operations in bulk
    const result = await Stock.bulkWrite(updateOperations);

    if (result.modifiedCount === 0) {
      throw new Error("No stock items were updated");
    }

    const updatedStock = await Stock.findById(id);
    res.status(200).send({ data: updatedStock });
  } catch (error) {
    console.error("Error updating stock: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};
