import IndividualGasRequest from "../models/individualgasRequet.model.js";
import Token from "../models/token.model.js";

/**
 * Get Token
 * @param {Request} req
 * @param {Response} res
 */
export const checkTokenValidation = async (req, res) => {
  const { token } = req.body;

  try {
    const tokenRes = await Token.findOne({ token });

    if (!tokenRes) {
      throw new Error("Invalid Token");
    }

    const gasRequestRes = await IndividualGasRequest.findOne({
      tokenId: tokenRes._id,
    }).populate("tokenId");

    if (!tokenRes) {
      throw new Error("Token not found");
    }

    if (new Date(tokenRes.expiryDate) <= new Date()) {
      throw new Error("Token is expired");
    }

    res.status(200).send({ data: gasRequestRes });
  } catch (error) {
    console.error("Error fetching Token: ", error.message);
    res.status(400).send({ message: error.message });
  }
};
