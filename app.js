require("dotenv").config();
//ログインセッション管理
const session = require('express-session');
const bodyParser = require('body-parser');

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
//  ログイン　////////////////////////////////////////////////////////
app.use(session({
  secret: 'secretsecretsecret',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }  ここを削除(SSH化して、HTTPS接続じゃないと使えない)
}));

app.use(bodyParser.json());


//////////////////////////////////////////////////////////

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


/*const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/views/my-page', (req, res) => {
  const userId = req.session.id;
console.log(`userID:${userId}`);
  // セッション情報のユーザーIDとundefinedを比較するif文
  if(req.session.userId === undefined) {
    console.log('ログインしていません')
  }else{
    console.log('ログインしています')
  }
  connection.query(
    'SELECT * FROM articles',
    (error, result) => {
      res.render('my-page.html', { articles: result });
    }
  );
});

app.get('/login', (req, res) => {
  res
    .type('text/html')
    .send(
      `<form method="POST" action="/login">
         <div>username<input type="text" name="username"></div>
         <div>password<input type="password" name="password"></div>
         <div><input type="submit" name="login"></div>
       </form>`
    )
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === 'admin' && password === 'password') {
    req.session.regenerate((err) => {
      req.session.username = 'admin';
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.use((req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/', (req, res) => {
  res.send('Hello ' + req.session.username);
});*/

module.exports = app;
