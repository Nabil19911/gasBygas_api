import businessTypeConstant from "../constant/businessType.js";
import IndividualGasRequest from "../models/individualgasRequet.model.js";
import OrganizationGasRequest from "../models/organizationGasRequest.model.js";
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
    let gasRequestRes = null;
    if (!tokenRes) {
      throw new Error("Invalid Token");
    }

    const inGasRequestRes = await IndividualGasRequest.findOne({
      tokenId: tokenRes._id,
    })
      .populate("tokenId")
      .populate("gas.type");

    if (inGasRequestRes) {
      gasRequestRes = {
        customerType: businessTypeConstant.Individual,
        ...inGasRequestRes.toObject(),
      };
    }

    if (!inGasRequestRes) {
      const OrgGasRequestRes = await OrganizationGasRequest.findOne({
        tokenId: tokenRes._id,
      })
        .populate("tokenId")
        .populate("gas.type");

      if (OrgGasRequestRes) {
        gasRequestRes = {
          customerType: businessTypeConstant.Organization,
          ...OrgGasRequestRes.toObject(),
        };
      }
    }

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
