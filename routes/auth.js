import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  const user = { name: username, role };

//   const isMatch = await bcrypt.compare(password, hash);

  const accessToken = jwt.sign(user, process.env.JWT_SECRET);
  res.json({ accessToken });
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log({ username, password });
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
