import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateToken = (length) => {
  return crypto.randomBytes(32).toString("hex").slice(0, length);
};

export const mailer = async () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
};
