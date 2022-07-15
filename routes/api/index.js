var express = require("express");
//const { route } = require("../../app.js");

var router = express.Router();

const artwork = require("../../src/artwork.js");
const user = require("../../src/user.js");

router.get("/editor/:art_id", async function (req, res, next) {
  console.log("index.js,router.get");
  const getArt = await artwork.getArt(req.params.art_id);
  //console.log(getArt);
  artwork.writeCode(getArt);
  res.send(getArt);
});

router.patch("/editor/:art_id", async function (req, res, next) {
  console.log("index.js,router.patch 1");
  const updateArt = await artwork.updateArt(req.params.art_id, req.body);
  const getArt = await artwork.getArt(req.params.art_id);
  artwork.writeCode(getArt);
  console.log("index.js,router.patch 2");
  res.send(updateArt);
});

router.post("/submit/:art_id", async function (req, res, next) {
  console.log("index.js router.post 1");
  await artwork.createThumbnail(req.params.art_id);
  const createArt = await artwork.publishArt(req.params.art_id);
  console.log("index.js router.post 2");
  res.send(createArt);
});

router.post("/regist/user", async function (req, res, next) {
  console.log("index.js router.post 1");
  const createUser = await user.postCreateUser(req.body);
  console.log("index.js router.post 2");
  //res.send(createUser);
  console.log(createUser);
  res.json({result:createUser})
});


router.post("/login/user", async function (req, res, next) {
  console.log("index.js router.post 1");
  console.log(req.body.password);
  const loginUser = await user.postLoginUser(req.body);
  console.log("index.js router.post 2");
  console.log(loginUser);
  console.log(req.body.userName);
  req.session.id = ({results:loginUser});
  console.log(req.session.id);
  res.json({result:loginUser});
});

router.get("/views/my-page", async function (req, res, next) {
  const userId = await user.getUserId(req.body);
  res.json({result:userId});
  /*const userId = req.session.id;
  console.log(`userID:${userId}`);
  // セッション情報のユーザーIDとundefinedを比較するif文
  if (req.session.userId === undefined) {
    console.log('ログインしていません');
  } else {
    console.log('ログインしています');
  }
  connection.query(
    'SELECT * FROM articles',
    (error, result) => {
      res.render('my-page.html', { articles: result });
    }
  );*/
});


/*ログイン
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
