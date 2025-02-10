import Scheduled from "../models/Schedule.model.js";

/**
 * get Scheduled
 * @param {Request} req
 * @param {Response} res
 */
export const getSchedule = async (req, res) => {
  try {
    // Find the first stock document
    const schedule = await Scheduled.find();

    // Send the stock data in response
    res.status(200).send({ data: schedule });
  } catch (error) {
    console.error("Error getting stock: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * get Scheduled by ID
 * @param {Request} req
 * @param {Response} res
 */
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the first stock document
    const schedule = await Scheduled.findById(id);

    // Send the stock data in response
    res.status(200).send({ data: schedule });
  } catch (error) {
    console.error("Error getting stock: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * update Scheduled
 * @param {Request} req
 * @param {Response} res
 */
export const createSchedule = async (req, res) => {
  try {
    const updateData = req.body;

    const schedule = await Scheduled(updateData);
    const respond = await schedule.save();

    if (!respond) {
      throw new Error("Schedule not found");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating stock: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * update Scheduled by ID
 * @param {Request} req
 * @param {Response} res
 */
export const updateScheduleById = async (req, res) => {
  try {
    const updateData = req.body;
    const { id } = req.params;

    const schedule = await Scheduled.findByIdAndUpdate(id, updateData);
    const respond = await schedule.save();

    if (!respond) {
      throw new Error("Schedule not found");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating stock: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};
