var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  if (req.session.uid) {
    res.render("login/gallery.ejs", {
      uid: req.session.uid,
    });
  } else {
    res.render("logout/gallery.ejs");
  }
});

router.post("/", async function (req, res, next) {
  req.session.uid = req.body.uid;
  res.redirect("/gallery");
});

module.exports = router;
