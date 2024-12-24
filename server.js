import createError from "http-errors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";

import usersRouter from "./routes/users.js";

const app = express();

const PORT = process.env.PORT;

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());


// Routes
app.use("/api/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(req.app.get('env') === 'development')
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

export default app;
