import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import rateLimit from "express-rate-limit";
import createError from "http-errors";

import connectDB from "./config/database.js";
import roles from "./constant/roles.js";
import authenticate from "./middleware/auth.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import createAdmin from "./helper/createAdmin.js";

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

// Middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(limiter);

// Routes
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);

// Handle 404 (Route not found)
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
      status,
    },
  });
});

// Connect to Database and Start Server
connectDB();
createAdmin();
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default app;
