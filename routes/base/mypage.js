var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  console.log("test");
  if (req.session.uid) {
    res.render("login/mypage.ejs", {
      uid: req.session.uid,
    });
  } else {
    res.redirect("/gallery");
  }
});

router.post("/", async function (req, res, next) {
  res.redirect("/mypage");
});

module.exports = router;
