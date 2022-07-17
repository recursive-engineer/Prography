// 新規登録処理
const mysql = require("mysql2/promise");
const config = require("../config.js");

checkUser = async function (data) {
  let connection = null;
  try {
    console.log("user.js checkUser 1");
    connection = await mysql.createConnection(config.dbSetting);
    const sql1 = "SELECT * FROM t_user WHERE name = ?;";
    const sql2 = "SELECT * FROM t_user WHERE email = ?;";
    const [rows1, fields1] = await connection.query(sql1, data.name);
    const [rows2, fields2] = await connection.query(sql2, data.email);
    var result = 0;
    if (rows1.length != 0) {
      result += 1;
    }
    if (rows2.length != 0) {
      result += 2;
    }
    console.log(result);
    console.log("user.js checkUser 2");
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

createUser = async function (data) {
  let connection = null;
  try {
    console.log("user.js createUser 1");
    connection = await mysql.createConnection(config.dbSetting);
    await connection.beginTransaction();
    const sql =
      "INSERT INTO `t_user`(`name`,`email`,`password`) VALUES(?,?,?);";
    let param = [data.name, data.email, data.password];
    const [rows, fields] = await connection.query(sql, param);
    console.log("user.js createUser 2");
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.checkUser = checkUser;
exports.createUser = createUser;
