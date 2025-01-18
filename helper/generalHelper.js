import crypto from "crypto";

export const generateToken = (length) => {
  return crypto.randomBytes(32).toString("hex").slice(0, length);
};
