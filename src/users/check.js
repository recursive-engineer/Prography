const mysql = require("mysql2/promise");
const config = require("../../config.js");

checkUser = async function (data) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM t_users where email = ?";
    const [rows, fields] = await connection.query(sql, data.email);
    var result = 0;
    if (rows.length != 0) {
      result = 1;
    }
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

checkPass = async function (data) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT id FROM t_users WHERE email = ? AND password = ? LIMIT 1;";
    const param = [data.email,data.password];
    const [rows, fields] = await connection.query(sql, param);
    let uid = 0;
    if (rows.length == 1) {
      uid = rows;
    }
    return uid;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.checkUser = checkUser;
exports.checkPass = checkPass;