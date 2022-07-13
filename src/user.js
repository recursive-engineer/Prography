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

  try {
    connection = await mysql.createConnection(config.dbSetting);
    await connection.beginTransaction();
    let sql = '';
    let d = [];
    const password = body.password;
    if (password === '') {
        sql = "SELECT * FROM t_user password ? WHERE id =?";
        d = [body.password,id];
        console.log("成功");
    } else {
      console.log(password);
      console.log("失敗");
    }
    const [rows, fields] = await connection.query(sql, d);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.log("エラー" + err);
  } finally {
    connection.end();
  }
}

exports.postCreateUser = postCreateUser;
exports.postLoginUser = postLoginUser;
