var express = require("express");

var router = express.Router();

const get = require("../../src/artworks/get.js");
const upd = require("../../src/artworks/update.js");
const del = require("../../src/artworks/delete.js");
const cre = require("../../src/artworks/create.js");

router.get("/get/code/:art_id/:file_name", async function (req, res, next) {
  const getArt = await get.getArt(req.params.art_id, req.params.file_name);
  res.json({ text: getArt });
});

router.get("/get/info/:art_id", async function (req, res, next) {
  const Info = await get.getArtInfo(req.params.art_id);
  res.json({
    title: Info[0].title,
    subtitle: Info[0].subtitle,
    publish: Info[0].publish,
    date: Info[0].date,
    name: Info[0].name,
    profession: Info[0].profession,
  });
});

router.get("/get/mypage/:user_id", async function (req, res, next) {
  const getMyArts = await get.mypage(req.params.user_id);
  res.send(getMyArts);
});

router.get("/get/gallery", async function (req, res, next) {
  const getArts = await get.gallery();
  res.send(getArts);
});

router.patch("/update/info", async function (req, res, next) {
  const updateInfo = await upd.updateInfo(req.body);
  await upd.updateDate(req.body);
  res.send(updateInfo);
});

router.patch("/update/artwork", async function (req, res, next) {
  const updateArt = await upd.updateArt(req.body);
  await upd.updateThumbnail(req.body);
  await upd.updateDate(req.body);
  res.json({ text: updateArt });
});

router.patch("/delete", async function (req, res, next) {
  await del.deleteThumbnail(req.body);
  await del.deleteCode(req.body);
  await del.deleteArt(req.body);
  res.json({ end: 1 });
});

router.get("/create/:user_id", async function (req, res, next) {
  const art_id = await cre.createArt(req.params.user_id);
  await cre.createCode(art_id);
  res.json({ id: art_id });
});

module.exports = router;
