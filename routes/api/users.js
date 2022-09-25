var express = require("express");
var router = express.Router();

const che = require("../../src/users/check.js");
const get = require("../../src/users/get.js");
//const upd = require("../../src/users/update.js");
//const del = require("../../src/users/delete.js");
const cre = require("../../src/users/create.js");

router.post("/check/signup", async function (req, res, next) {
  const checkUser = await che.checkUser(req.body);
  res.json({result: checkUser});
});

router.post("/check/signin", async function (req, res, next) {
  const checkPass = await che.checkPass(req.body);
  res.json({uid: checkPass});
});

router.get("/get/info/:user_id", async function (req, res, next) {
  const getUserInfo = await get.getUserInfo(req.params.user_id);
  res.json({info: getUserInfo});
});

router.post("/create", async function (req, res, next) {
  const createUser = await cre.createUser(req.body);
  res.json({uid: createUser});
});

module.exports = router;
