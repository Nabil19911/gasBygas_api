import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import roles from "../constant/roles.js";
import User from "../schema/user.schema.js";

const router = Router();

router.post("/employee/login", async (req, res) => {
  const { username, password } = req.body;
  const { password: hash, role } = await User.findOne({ role: roles.ADMIN });

  const isMatch = await bcrypt.compare(password, hash);

  if (!isMatch) {
    res.status(401).send({
      message: "Invalid credentials. Please try again.",
    });
    return;
  }

  const user = { name: username, role };

  const accessToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: user,
    },
    process.env.JWT_SECRET
  );
  res.send({ accessToken });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  // const { password: hash, role } = await User.findOne({ role: roles.ADMIN });

  // const isMatch = await bcrypt.compare(password, hash);

  // if (!isMatch) {
  //   res.status(401).send({
  //     message: "Invalid credentials. Please try again.",
  //   });
  //   return;
  // }

  // const user = { name: username, role };

  // const accessToken = jwt.sign(
  //   {
  //     exp: Math.floor(Date.now() / 1000) + 60 * 60,
  //     data: user,
  //   },
  //   process.env.JWT_SECRET
  // );
  // res.send({ accessToken });
});

router.post("/fresh-token", (req, res) => {
  const { exp, role, username } = req.body;

  const user = { name: username, role };

  return bcrypt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: user,
    },
    process.env.JWT_SECRET
  );
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
  } catch (e) {
    console.log(e);
  }
  res.send({ message: "user signup" });
});

export default router;
