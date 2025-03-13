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
import schemaModels from "../constant/schemaModels.js";
import Stock from "../models/stock.model.js";

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
      .populate("tokenId")
      .populate("gas.type");

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
      .populate("tokenId")
      .populate("gas.type");

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
      .populate("outletId")
      .populate({
        path: "gas",
        populate: {
          path: "type",
          model: schemaModels.GasType,
        },
      });

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

    const isApproved =
      data.headOfficeApproval.status === requestStatus.APPROVED;

    // Update OutletGasRequest
    const respond = await OutletGasRequest.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!respond) {
      throw new Error("Update head office approval failed");
    }

    if (isApproved) {
      const outletId = respond.outletId; // Correct outlet ID

      await Promise.all(
        respond.gas.map(async (item) => {
          // Update Stock
          await Stock.updateMany(
            { "stock.gasType": item.type },
            {
              $inc: {
                "stock.$.reservedStock": item.approvedGasQuantity,
                "stock.$.currentStock": -item.approvedGasQuantity,
              },
            }
          );

          // Update Outlet's Incoming Stock
          await Outlet.updateOne(
            { _id: outletId, "cylinders_stock.type": item.type },
            {
              $inc: {
                "cylinders_stock.$.incomingStock": item.approvedGasQuantity,
              },
            }
          );
        })
      );
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating outlet gas request:", error);
    res.status(500).send({ message: "Error updating outlet gas request" });
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

    if (
      activeGasRequest.length ===
      outlet.gas_request.allowed_qty + outlet.gas_request.allowed_waiting_qty
    ) {
      console.error("Token Limit Reached");
      throw new Error(
        `Request Limit Reached for ${outlet.branch_code}, Please select a different outlet`
      );
    }

    const activeToken = activeGasRequest.filter(
      (gasRequest) => gasRequest.tokenId
    );

    if (activeToken.length === outlet.gas_request.allowed_qty) {
      const gasRequest = await IndividualGasRequest({
        ...data,
        isWaiting: true,
      });
      await gasRequest.save();
      return res.status(201).send({ data: { gasRequest } });
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
      throw new Error("Gas request reallocation failed");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating gas request payment:", error);
    res.status(500).send({ message: error.message });
  }
};

/**
 * delete individual gas request
 * @param {Request} req
 * @param {Response} res
 */
export const deleteIndividualGasRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const singleValue = await IndividualGasRequest.findById(id);
    const tokenId = singleValue.tokenId;

    await Token.findByIdAndUpdate(
      tokenId,
      {
        $set: {
          status: activeStatus.INACTIVE,
        },
      },
      {
        new: true,
      }
    );

    const respond = await IndividualGasRequest.findByIdAndUpdate(
      id,
      { $set: data },
      {
        new: true,
      }
    );

    if (!respond) {
      throw new Error("delete individual gas request failed");
    }

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error deleting gas request payment:", error);
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
    const data = req.body;

    const saveData = {
      reallocateGasRequest: {...data.reallocateGasRequest},
      scheduleId: data.reallocateGasRequest.toSheduleId,
    };

    const activeRequest = data.activeGasRequestIds;

    if (!Array.isArray(activeRequest) || activeRequest.length === 0) {
      throw new Error("No active gas requests provided");
    }

    // Use Promise.all to wait for all updates
    const updatedRequests = await Promise.all(
      activeRequest.map((active) =>
        IndividualGasRequest.findByIdAndUpdate(
          active,
          { $set: saveData },
          { new: true }
        )
      )
    );

    // Check if any updates failed
    if (updatedRequests.some((request) => request === null)) {
      throw new Error("One or more gas requests failed to update");
    }

    res.status(200).send({ data: updatedRequests });
  } catch (error) {
    console.error("Error updating gas request:", error);
    res.status(500).send({ message: error.message });
  }
};

/**
 * update reallocate customer gas request
 * @param {Request} req
 * @param {Response} res
 */
export const updateReallocateGasRequestToCustomerById = async (req, res) => {
  try {
    const data = req.body;

    const currentUser = await User.findById(data.currentCustomerId);
    if (!currentUser) {
      throw new Error("Current customer not found");
    }

    const selectedCustomer = await User.findById(data.selectedCustomerId);
    if (!selectedCustomer) {
      throw new Error("Selected customer not found");
    }

    const token = await Token.findById(data.activeToken);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templateTokenUpdatedPath = path.join(
      __dirname,
      "..",
      "emailTemplates",
      "customerTokenUpdated.ejs"
    );

    const emailTokenUpdatedHtml = await ejs.renderFile(
      templateTokenUpdatedPath,
      { tokenId: token.token }
    );

    const templateTokenRevokePath = path.join(
      __dirname,
      "..",
      "emailTemplates",
      "customerTokenRevoke.ejs"
    );

    const emailTokenRevokeHtml = await ejs.renderFile(
      templateTokenRevokePath,
      {}
    );

    const mailOptions = [
      {
        from: process.env.MY_EMAIL,
        to: currentUser.email,
        subject: "Your Gas Token Revoked",
        html: emailTokenRevokeHtml,
      },
      {
        from: process.env.MY_EMAIL,
        to: selectedCustomer.email,
        subject: "Your Gas Token",
        html: emailTokenUpdatedHtml,
      },
    ];

    const transporter = await mailer();
    await Promise.all(
      mailOptions.map((options) => transporter.sendMail(options))
    );

    const respond = await IndividualGasRequest.findOneAndUpdate(
      { userId: data.selectedCustomerId },
      { $set: { tokenId: data.activeToken, isWaiting: false } },
      { new: true }
    );

    if (!respond) {
      throw new Error("Reallocation to customer failed");
    }

    const saveData = {
      ...data,
      tokenId: null,
      status: activeStatus.INACTIVE,
    };

    await IndividualGasRequest.findOneAndUpdate(
      { userId: data.currentCustomerId },
      { $set: saveData },
      { new: true }
    );

    res.status(200).send({ data: respond });
  } catch (error) {
    console.error("Error updating reallocation customer failed:", error);
    res.status(500).send({ message: error.message });
  }
};
