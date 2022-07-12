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

getArtworks = async function (user_id) {
  console.log("user.js getArtworks");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT id FROM artwork WHERE author_id = ?;";
    let param = [user_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.postCreateUser = postCreateUser;
exports.getArtworks = getArtworks;
