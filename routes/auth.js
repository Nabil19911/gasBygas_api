import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import roles from "../constant/roles.js";
import User from "../schema/user.schema.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { password: hash, role } = await User.findOne({ role: roles.ADMIN });

  const isMatch = await bcrypt.compare(password, hash);

  if (!isMatch) {
    res.status(403).send({
      message: "Invalid credentials. Please try again.",
    });
    return;
  }

  const user = { name: username, role };

  const accessToken = jwt.sign(user, process.env.JWT_SECRET);
  res.send({ accessToken });
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
