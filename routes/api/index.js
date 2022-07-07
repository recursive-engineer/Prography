var express = require("express");

var router = express.Router();

const artwork = require("../../src/artwork.js");

router.get("/artwork/:art_id", async function (req, res, next) {
  console.log("index.js,router.get");
  const getArt = await artwork.getArt(req.params.art_id);
  //console.log(getArt);
  artwork.writeCode(getArt);
  res.send(getArt);
});

router.patch("/artwork/:art_id", async function (req, res, next) {
  console.log("index.js,router.patch");
  const updateArt = await artwork.updateArt(req.params.art_id, req.body);
  res.send(updateArt);
});

//  組織管理ユーザ関連API

/* ユーザを1件取するルーティング */
router.get("/get/ouser/:id", async function (req, res, next) {
  const getUserId = await o_get.getUserId(req.params.id);
  res.send(getUserId);
});

/* 組織所属ユーザを登録するルーティング */
router.post("/regist/ouser", async function (req, res, next) {
  const createOuser = await o_create.postCreateOuser(req.body)
  res.send(createOuser);
});

/* ユーザを1件更新するルーティング */
router.patch("/update/ouser/:id", async function (req, res, next) {
  const patchUserId = await o_update.patchUserId(req.params.id, req.body);
  res.send(patchUserId);
});

/* ユーザを削除するルーティング */
router.delete("/delete/ouser/:id", async function (req, res, next) {
  const deleteUserId = await o_delete.deleteUserId(req.params.id);
  res.send(deleteUserId);
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
