var express = require("express");

var router = express.Router();

const artwork = require("../../src/artwork.js");
const user = require("../../src/user.js");

router.get("/editor/:art_id/:file_name", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  const getArt = await artwork.getArt(req.params.art_id, req.params.file_name);
  //console.log("index.js,router.get 2");
  res.json({ text: getArt });
});

router.get("/editor/:art_id", async function (req, res, next) {
  //console.log("index.js,router.get 1");
  const Info = await artwork.getArtInfo(req.params.art_id);
  //console.log("index.js,router.get 2");
  res.send(Info);
});

router.get("/newcode/:user_id", async function (req, res, next) {
  console.log("index.js,router.get 1");
  const art_id = await artwork.createNewCode(req.params.user_id);
  console.log(art_id);
  const end = await artwork.createNewFile(art_id);
  console.log("index.js,router.get 2");
  res.json({ id: art_id, end: end });
});

router.patch("/editor/:art_id/:file_name", async function (req, res, next) {
  //console.log("index.js,router.patch 1");
  //await artwork.createThumbnail(req.params.art_id);
  const updateArt = await artwork.updateArt(
    req.params.art_id,
    req.params.file_name,
    req.body
  );
  //console.log("index.js,router.patch 2");
  res.json({ text: updateArt });
});

router.post("/editor/:art_id", async function (req, res, next) {
  //console.log("index.js router.post 1");
  const updateInfo = await artwork.updateInfo(req.params.art_id, req.body);
  //console.log("index.js router.post 2");
  res.send(updateInfo);
});

router.post("/submit", async function (req, res, next) {
  //console.log("index.js router.post 1");
  await artwork.editThumbnail(req.body);
  const createArt = await artwork.publishArt(req.body);
  //console.log("index.js router.post 2");
  res.send(createArt);
});

router.post("/regist/user", async function (req, res, next) {
  //console.log("index.js router.post 1");
  const createUser = await user.postCreateUser(req.body);
  //console.log("index.js router.post 2");
  res.send(createUser);
});

router.get("/my-page/:user_id", async function (req, res, next) {
  //console.log("index.js,router.get");
  const getArtworks = await user.getArtworks(req.params.user_id);
  res.send(getArtworks);
});

/*
タスク一覧を取得するルーティング
router.get("/tasks/:user_id", async function (req, res, next) {
  const getTasks = await tasks.getTasks(req.params.user_id);
  res.send(getTasks);
});

タスク一覧を削除するルーティング
router.delete("/tasks/:user_id/:task_id", async function (req, res, next) {
  const deleteTasksId = await tasks.deleteTasksId(req.params.task_id,req.params.user_id);
  res.send(deleteTasksId);
});

タスクを1件取するルーティング
router.get("/tasks/:user_id/:task_id", async function (req, res, next) {
  const getTasksId = await tasks.getTasksId(req.params.user_id,req.params.task_id);
  res.send(getTasksId);
});

並び替えられたタスクを取得するルーティング
router.get("/tasks/:user_id/:sort/:asc", async function (req, res, next) {
  const getSortedTasks = await tasks.getSortedTasks(req.params.user_id,req.params.sort,req.params.asc);
  res.send(getSortedTasks);
});

タスクを1件更新するルーティング
router.patch("/tasks/:user_id/:task_id", async function (req, res, next) {
  console.log(req.param);
  console.log("index.js");
  const patchTasksId = await tasks.patchTasksId(req.params.user_id,req.params.task_id,req.body);
  res.send(patchTasksId);
});
*/

module.exports = router;
