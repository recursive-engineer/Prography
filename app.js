require("dotenv").config();
const env = process.env.environment;

const createError = require("http-errors");
const express = require("express");
let path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const apiRouter = require("./routes/api/index.js");
const gallary = require("./routes/gallary.js");

let app = express();

//セッション
// const session = require('express-session');
// var session_opt = {
//   secret: 'keyword  cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 60 * 60 * 1000 }
// }
// app.use(session(session_opt));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);
app.use("/gallary", gallary);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
