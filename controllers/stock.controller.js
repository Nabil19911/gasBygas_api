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
    const stock = await Stock.findOne().populate({
      path: "stock.gasType", // Populate gasType inside stock array
    });

    if (!stock) {
      res.status(200).send({ data: {}, message: "No stock data found" });
      return;
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

      update.gasType = gasType;

      // Check if gasType exists in the stock
      const existingStock = await Stock.findOne({
        _id: id,
        "stock.gasType": gasType,
      });

      if (existingStock) {
        // Build update operations for existing gasType
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
      } else {
        // Add new gasType to the stock
        const newStockItem = {
          gasType,
          currentStock: updates.currentStock || 0,
          maximumCapacity: updates.maximumCapacity || 0,
          minimumThreshold: updates.minimumThreshold || 0,
        };

        updateOperations.push({
          updateOne: {
            filter: { _id: id },
            update: { $push: { stock: newStockItem } },
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

/**
 * add Stock
 * @param {Request} req
 * @param {Response} res
 */
export const createStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (!stock || !Array.isArray(stock)) {
      throw new Error("Stock data must be provided as an array");
    }

    const newStock = await Stock.create({ stock });

    res.status(201).send({ data: newStock });
  } catch (error) {
    console.error("Error creating stock: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};
