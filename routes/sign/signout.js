var express = require("express");
var router = express.Router();

router.get('/', async function (req, res, next) {
  if (req.session.uid) {
    console.log("login");
    res.render('login/gallery.ejs',{
        uid: req.session.uid
    });
  }else{
    console.log("logout");
    res.render('logout/gallery.ejs');
  }
});

router.post('/', async function (req, res, next) {
  console.log("signout");
  req.session.uid = "";
  res.redirect('/gallery');
});

module.exports = router;