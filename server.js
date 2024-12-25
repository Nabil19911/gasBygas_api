import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import authenticate from "./middleware/auth.js";
import roles from "./constant/roles.js";

const app = express();

const PORT = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/auth", limiter, authRouter);
app.use("/api/users", limiter, authenticate([roles.ADMIN]), usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

export default app;
