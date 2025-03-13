import deliveryStatus from "../constant/deliveryStatus.js";
import IndividualGasRequest from "../models/individualgasRequet.model.js";
import Scheduled from "../models/Schedule.model.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { mailer } from "../helper/generalHelper.js";

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

    if (updateData.status === deliveryStatus.OutForDelivery) {
      let deliveryDate = new Date(updateData.deliveryDate);

      // Subtract 3 days
      deliveryDate.setDate(deliveryDate.getDate() - 3);
      updateData.outForDeliveryTime = new Date();
      const individualGasRequestUsers = await IndividualGasRequest.find({
        scheduleId: id,
      }).populate("userId");
      const emails = individualGasRequestUsers.map((user) => user.userId.email);

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const templatePath = path.join(
        __dirname,
        "..",
        "emailTemplates",
        "gasHandover.ejs"
      );
      const emailHtml = await ejs.renderFile(templatePath, {
        date: deliveryDate.toDateString(),
      });

      const mailOptions = {
        from: process.env.MY_EMAIL,
        to: emails,
        subject: "Gas Handover Mail",
        html: emailHtml,
      };

      const transporter = await mailer(mailOptions);
      await transporter.sendMail(mailOptions);
    }

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
