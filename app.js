require('dotenv').config();
const env = process.env.environment;
console.log(env);

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var apiRouter = require("./routes/api/index.js");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);

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

/*
const express = require('express');
const mysql = require('mysql');
var router = express.Router();
const app = express();

app.use(express.static('public'));

const artwork = require("../../src/artwork.js");

router.get('/artwork/:art_id',  async function (req, res, next){
  const getArt = await artwork.getArt(req.params.art_id);
  res.send(getArt);
});


connection.query(
  'SELECT * FROM artwork',
  (error, results) => {
    console.log(results);
    res.render('artwork.ejs');
  }
);


app.get('/header',(req,res)=>{
  res.render('header.ejs')
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'edge4162',
  database: 'prography'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.listen(3000);
module.exports = router;
*/
