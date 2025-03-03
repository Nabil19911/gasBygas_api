import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import activeStatus from "../constant/activeStatus.js";
import { generateToken, mailer } from "../helper/generalHelper.js";
import OutletGasRequest from "../models/outletGasRequest.model.js";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import IndividualGasRequest from "../models/individualgasRequet.model.js";
import OrganizationGasRequest from "../models/organizationGasRequest.model.js";
import requestStatus from "../constant/requestStatus.js";
import Outlet from "../models/outlet.model.js";

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

    const respond = await IndividualGasRequest.find(filter)
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
    res.status(500).send({ message: error.message });
  }
};

/**
 * get Organization Gas Requets
 * @param {Request} req
 * @param {Response} res
 */
export const getOrganizationGasRequest = async (req, res) => {
  try {
    const { userId, tokenId } = req.query;

    const filter = {};
    if (userId && userId !== "undefined") filter.userId = userId;
    if (tokenId && tokenId !== "undefined") filter.tokenId = tokenId;

    const respond = await OrganizationGasRequest.find(filter)
      .populate("userId")
      .populate("tokenId");

    if (!respond || respond.length === 0) {
      console.log("No records found for the given filter.");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send({ message: error.message });
  }
};

/**
 * get Gas Requets
 * @param {Request} req
 * @param {Response} res
 */
export const getOrganizationGasRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const respond = await OrganizationGasRequest.findById(id)
      .populate("userId")
      .populate("tokenId");

    if (!respond || respond.length === 0) {
      console.log("No records found.");
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
export const updateOutletGasRequestById = async (req, res) => {
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
 * get Gas Requets
 * @param {Request} req
 * @param {Response} res
 */
export const updateOrganizationGasRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const isApproved =
      data.headOfficeApproval.status === requestStatus.APPROVED;

    if (!isApproved) {
      const respond = await OrganizationGasRequest.findByIdAndUpdate(
        id,
        { ...data },
        {
          new: true,
        }
      );

      res.status(200).send({ data: respond });
      return;
    }

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

    const respond = await OrganizationGasRequest.findByIdAndUpdate(
      id,
      { ...data, tokenId: token._id },
      {
        new: true,
      }
    );

    if (!respond) {
      throw new Error("update head office approval failed");
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

    res.status(200).send({ data: { respond, emailRespond, token } });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send({ message: error.message });
  }
};

/**
 * Create new gas request for Individual
 * @param {Request} req
 * @param {Response} res
 */
export const createIndividualGasRequest = async (req, res) => {
  try {
    const data = req.body;
    const generateGasToken = generateToken(20);

    const currentDate = new Date(); // Get the current date
    currentDate.setDate(currentDate.getDate() + 14); // Add 14 days

    const activeGasRequest = await IndividualGasRequest.find({
      outletId: data.outletId,
    });
    const outlet = await Outlet.findById(data.outletId);

    if (activeGasRequest.length === outlet.gas_request.allowed_qty) {
      console.error("Token Limit Reached");
      throw new Error(
        `Token Limit Reached for ${outlet.branch_code}, Please select a different outlet`
      );
    }

    const token = await Token({
      token: generateGasToken,
      expiryDate: currentDate,
      status: activeStatus.PENDING,
    });
    const tokenResponse = await token.save();

    if (!tokenResponse) {
      throw new Error("Token is not created");
    }

    const gasRequest = await IndividualGasRequest({
      ...data,
      tokenId: token._id,
    });
    const gasRequestResponse = await gasRequest.save();

    if (!gasRequestResponse) {
      throw new Error("gas Request is not created");
    }

    const user = await User.findById({ _id: data.userId });

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
    console.error("Error creating gas request: ", error.message);
    res.status(400).send({ message: `${error.message}` });
  }
};

/**
 * Create new gas request organization
 * @param {Request} req
 * @param {Response} res
 */
export const createOrganizationGasRequest = async (req, res) => {
  try {
    const gasRequest = await OrganizationGasRequest({
      ...req.body,
    });
    const gasRequestResponse = await gasRequest.save();

    if (!gasRequestResponse) {
      throw new Error("gas Request is not created");
    }

    res.status(201).send({ data: gasRequest });
  } catch (error) {
    console.error("Error creating customers: ", error.message);
    res.status(400).send({ message: `Error: ${error.message}` });
  }
};

/**
 * get individual gas request by ID
 * @param {Request} req
 * @param {Response} res
 */
export const getIndividualGasRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await IndividualGasRequest.findById(id)
      .populate("userId")
      .populate("outletId")
      .populate("scheduleId")
      .populate("gas.type");

    if (!response) {
      throw new Error("No Individual gas request fetched");
    }
    res.status(201).send({ data: response });
  } catch (error) {
    console.error("Error fetching individual gas reqquest: ", error.message);
    res.status(400).send({ message: error.message });
  }
};

/**
 * update individual gas request
 * @param {Request} req
 * @param {Response} res
 */
export const updateIndividualGasRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const respond = await IndividualGasRequest.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
      }
    );

    if (!respond) {
      throw new Error("update gas request payment failed");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating gas request payment:", error);
    res.status(500).send({ message: error.message });
  }
};

/**
 * update reallocate individual gas request
 * @param {Request} req
 * @param {Response} res
 */
export const updateReallocateIndividualGasRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const saveData = {
      ...data,
      scheduleId: data.reallocateGasRequest.toSheduleId,
    };

    const respond = await IndividualGasRequest.findByIdAndUpdate(
      id,
      { $set: saveData },
      {
        new: true,
      }
    );

    if (!respond) {
      throw new Error("update gas request payment failed");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating gas request payment:", error);
    res.status(500).send({ message: error.message });
  }
};
