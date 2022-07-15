// 新規登録処理
const mysql = require("mysql2/promise");
const config = require("../config.js");


postCreateUser = async function (body) {
  let connection = null;

  try {
    console.log("user.js");
    connection = await mysql.createConnection(config.dbSetting);
    await connection.beginTransaction();
    const sql =
      "INSERT INTO `t_user`(`user_name`,`email`,`password`) VALUES(?,?,?);";
    let d = [body.userName, body.email, body.password];

    const [rows, fields] = await connection.query(sql, d);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.log("エラー" + err);
  } finally {
    connection.end();
  }
};


postLoginUser = async function (body) {
  let connection = null;
  console.log("user.js postloginuser1");
  try {
    connection = await mysql.createConnection(config.dbSetting);
    await connection.beginTransaction();
    let sql = '';
    let d = [];
    const password = body.password;
    sql = "SELECT * FROM t_user WHERE user_name=?";
    d = [body.userName];
    console.log("成功");
    const [rows, fields] = await connection.query(sql, d);
    await connection.commit();
    console.log("user.js postloginuser2");
    for(var i=0;i<rows.length;i++) {
      if(rows[i].password == password) {
        console.log("if rows1");
        return rows[i].id;
      }
    }
    console.log("if rows2");
    return 0;
  } catch (err) {
    await connection.rollback();
    console.log("エラー" + err);
  } finally {
    connection.end();
  }
};


getUserId = async function (id) {
  const userId = req.session.id;
  console.log(`userID:${userId}`);
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    //const sql = "SELECT * FROM articles WHERE id = ?;";
    const sql = "SELECT * FROM articles;";
    let param = [id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.postCreateUser = postCreateUser;
exports.postLoginUser = postLoginUser;
exports.getUserId = getUserId;