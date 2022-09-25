var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
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

module.exports = router;