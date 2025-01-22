import requestStatus from "../constant/requestStatus.js";
import { generateToken } from "../helper/generalHelper.js";
import GasRequest from "../models/gasRequet.model.js";
import Token from "../models/token.model.js";

/**
 * Create new user
 * @param {Request} req
 * @param {Response} res
 */
export const createNewGasRequest = async (req, res) => {
  try {
    const generateGasToken = generateToken(20);

    const currentDate = new Date(); // Get the current date
    currentDate.setDate(currentDate.getDate() + 14); // Add 14 days
    // const token = await Token({
    //   token: generateGasToken,
    //   expiryDate: currentDate,
    //   status: requestStatus.PENDING,
    // });

    // const gasRequest = await GasRequest({ ...req.body, tokenId: token._id });

    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);

    // const templatePath = path.join(
    //   __dirname,
    //   "..",
    //   "emailTemplates",
    //   "tokenGenerated.ejs"
    // );
    // const emailHtml = await ejs.renderFile(templatePath, {
    //   password: generatePassword,
    // });

    // const mailOptions = {
    //   from: process.env.MY_EMAIL,
    //   to: email,
    //   subject: "Your Gas Token Request",
    //   html: emailHtml,
    // };

    // const transporter = await mailer(mailOptions);
    // const emailRespond = await transporter.sendMail(mailOptions);

    res.status(201).send({ data: { token } });
  } catch (error) {
    console.error("Error creating customers: ", error.message);
    res.status(400).send({ error: `Error: ${error.message}` });
  }
};
