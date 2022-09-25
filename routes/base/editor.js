var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  if (req.session.uid) {
    res.render("login/editor.ejs", {
      uid: req.session.uid,
      aid: req.session.aid,
    });
  } else {
    res.redirect("/gallery");
  }
});

router.post("/", async function (req, res, next) {
  req.session.aid = req.body.aid;
  res.redirect("/editor");
});

module.exports = router;
