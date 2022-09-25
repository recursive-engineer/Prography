const mysql = require("mysql2/promise");
const config = require("../../config.js");

getUserInfo = async function (user_id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT name,email,profession FROM t_users WHERE id = ? LIMIT 1;";
    const [rows, fields] = await connection.query(sql,user_id);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.getUserInfo = getUserInfo;