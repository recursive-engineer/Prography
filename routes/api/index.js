var express = require("express");

var router = express.Router();

const artwork = require("../../src/artwork.js");
const newcode = require("../../src/newcode.js");
const editor = require("../../src/editor.js");
const mypage = require("../../src/mypage.js");
const gallery = require("../../src/gallery.js");
const user = require("../../src/user.js");

router.get("/artwork/:art_id/:file_name", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  const getArt = await artwork.getArt(req.params.art_id, req.params.file_name);
  //console.log("index.js,router.get 2");
  res.json({ text: getArt });
});

router.get("/artwork/:art_id", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  const Info = await artwork.getArtInfo(req.params.art_id);
  //console.log("index.js,router.get 2");
  res.send(Info);
});

router.patch("/artwork/updateInfo", async function (req, res, next) {
  //console.log("index.js router.post 1");
  const updateInfo = await artwork.updateInfo(req.body);
  await artwork.updateDate(req.body);
  //console.log("index.js router.post 2");
  res.send(updateInfo);
});

router.patch("/artwork/updateArt", async function (req, res, next) {
  //console.log("index.js,router.patch 1");
  //console.log(req.body);
  const updateArt = await artwork.updateArt(req.body);
  //console.log(updateArt);
  await artwork.updateThumbnail(req.body);
  await artwork.updateDate(req.body);
  //console.log("index.js,router.patch 2");
  res.json({ text: updateArt });
});

router.patch("/artwork/delete", async function (req, res, next) {
  //console.log("index.js,router.patch 1");
  await artwork.deleteThumbnail(req.body);
  await artwork.deleteCode(req.body);
  await artwork.deleteArt(req.body);
  //console.log("index.js,router.patch 2");
  res.json({ end: 1 });
});

//newcode.html
router.get("/newcode/:user_id", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  const art_id = await newcode.createArt(req.params.user_id);
  const end = await newcode.createCode(art_id);
  //console.log("index.js,router.get 2");
  res.json({ id: art_id, end: end });
});

//signup.html
router.post("/user/signup/check", async function (req, res, next) {
  //console.log("index.js router.post 1");
  const checkUser = await user.checkUser(req.body);
  //console.log("index.js router.post 2");
  res.json({ result: checkUser });
});

router.post("/user/signup/create", async function (req, res, next) {
  //console.log("index.js router.post 1");
  const createUser = await user.createUser(req.body);
  //console.log("index.js router.post 2");
  res.json({ user_id: createUser });
});

//signin.html
router.post("/user/signin", async function (req, res, next) {
  //console.log("index.js router.post 1");
  const signUser = await user.signUser(req.body);
  //console.log("index.js router.post 2");
  res.json({ user_id: signUser });
});

router.get("/user/:user_id", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  //console.log(req.params.user_id);
  const getUser = await user.getUser(req.params.user_id);
  //console.log("index.js,router.get 2");
  res.send(getUser);
});

//mypage.html
router.get("/mypage/:user_id", async function (req, res, next) {
  //console.log("index.js,router.get");
  const getMyArts = await mypage.getMyArts(req.params.user_id);
  res.send(getMyArts);
});

//gallery.html
router.get("/gallery/get", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  const getArts = await gallery.getArts();
  //console.log("index.js,router.get 2");
  res.send(getArts);
});

module.exports = router;
