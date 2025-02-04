import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import activeStatus from "../constant/activeStatus.js";
import { generateToken, mailer } from "../helper/generalHelper.js";
import GasRequest from "../models/gasRequet.model.js";
import OutletGasRequest from "../models/outletGasRequest.model.js";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";

/**
 * get Gas Requets
 * @param {Request} req
 * @param {Response} res
 */
export const getGasRequest = async (req, res) => {
  try {
    const { userId, outletId, tokenId } = req.query;

    const filter = {};
    if (userId !== "undefined") filter.userId = userId;
    if (outletId !== "undefined") filter.outletId = outletId;
    if (tokenId !== "undefined") filter.tokenId = tokenId;

    const respond = await GasRequest.find(filter)
      .populate("userId")
      .populate("outletId")
      .populate("tokenId")
      .populate("scheduleId");

    if (!respond || respond.length === 0) {
      console.log("No records found for the given filter.");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send({ message: "Error fetching schedules" });
  }
};

/**
 * get Gas Requets
 * @param {Request} req
 * @param {Response} res
 */
export const getOutletGasRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const respond = await OutletGasRequest.findById(id)
      .populate("scheduleId")
      .populate("outletId");

    if (!respond || respond.length === 0) {
      console.log("No records found for the given filter.");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send({ message: "Error fetching schedules" });
  }
};

/**
 * get Gas Requets
 * @param {Request} req
 * @param {Response} res
 */
export const patchOutletGasRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const respond = await OutletGasRequest.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!respond) {
      throw new Error("update head office approval failed");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send({ message: "Error fetching schedules" });
  }
};

/**
 * Create new gas request
 * @param {Request} req
 * @param {Response} res
 */
export const createNewGasRequest = async (req, res) => {
  try {
    const generateGasToken = generateToken(20);

    const currentDate = new Date(); // Get the current date
    currentDate.setDate(currentDate.getDate() + 14); // Add 14 days

    const token = await Token({
      token: generateGasToken,
      expiryDate: currentDate,
      status: activeStatus.PENDING,
    });
    const tokenResponse = await token.save();

    if (!tokenResponse) {
      throw new Error("Token is not created");
    }

    const gasRequest = await GasRequest({ ...req.body, tokenId: token._id });
    const gasRequestResponse = await gasRequest.save();

    if (!gasRequestResponse) {
      throw new Error("gas Request is not created");
    }

    const user = await User.findById({ _id: req.body.userId });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(
      __dirname,
      "..",
      "emailTemplates",
      "tokenGenerated.ejs"
    );
    const emailHtml = await ejs.renderFile(templatePath, {
      gasToken: generateGasToken,
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: user.email,
      subject: "Your Gas Token Request",
      html: emailHtml,
    };

    const transporter = await mailer(mailOptions);
    const emailRespond = await transporter.sendMail(mailOptions);

    res.status(201).send({ data: { gasRequest, emailRespond, token } });
  } catch (error) {
    console.error("Error creating customers: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};
