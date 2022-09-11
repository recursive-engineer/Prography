var express = require("express");

var router = express.Router();

router.get("/", async function (req, res, next) {
  res.render("gallery",{
    title: "作品ギャラリー"
  })
});

module.exports = router;