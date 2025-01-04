import jwt from "jsonwebtoken";

export const createJWT = (data) => {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data,
    },
    process.env.JWT_SECRET
  );
};
