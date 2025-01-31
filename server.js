import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import rateLimit from "express-rate-limit";
import createError from "http-errors";
import cors from "cors";

import connectDB from "./config/database.js";
import authRouter from "./routes/auth.route.js";
import employeeRouter from "./routes/employee.route.js";
import userRouter from "./routes/user.route.js";
import outletRouter from "./routes/outlet.route.js";
import stockRouter from "./routes/stock.route.js";
import gasRequestRouter from "./routes/gasRquest.route.js";
import scheduleRouter from "./routes/schedule.route.js";
import tokenRouter from "./routes/token.route.js";
import { initializeAdmin, initializeStock } from "./helper/employeeHelper.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 20 requests per window
});

const corsOptions = {
  origin: "http://localhost:3000", // Allow only from 3000 port
};

// Middleware
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(limiter);

// Routes
app.use("/auth", authRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/user", userRouter);
app.use("/api/outlet", outletRouter);
app.use("/api/gas-request", gasRequestRouter);
app.use("/api/stock", stockRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/token", tokenRouter);

// Get the current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/upload", express.static(path.join(__dirname, "upload")));

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
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
  initializeAdmin();
  initializeStock();
});

export default app;
