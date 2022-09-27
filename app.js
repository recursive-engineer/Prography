require("dotenv").config();
const env = process.env.environment;

var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const baseRouter = require("./routes/base.js");
const usersRouter = require("./routes/api/users.js");
const artworksRouter = require("./routes/api/artworks.js");
const signin = require("./routes/sign/signin.js");
const signup = require("./routes/sign/signup.js");
const signout = require("./routes/sign/signout.js");
const gallery = require("./routes/base/gallery.js");
const newcode = require("./routes/base/newcode.js");
const mypage = require("./routes/base/mypage.js");
const editor = require("./routes/base/editor.js");
const viewer = require("./routes/base/viewer.js");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    // cookie:{
    // httpOnly: true,
    // secure: false,
    // maxage: 1000 * 60 * 30
    // }
  })
);

app.use("/", baseRouter);
app.use("/api/users", usersRouter);
app.use("/api/artworks", artworksRouter);
app.use("/signin", signin);
app.use("/signup", signup);
app.use("/signout", signout);
app.use("/gallery", gallery);
app.use("/newcode", newcode);
app.use("/mypage", mypage);
app.use("/editor", editor);
app.use("/viewer", viewer);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error.jade");
});

module.exports = app;
