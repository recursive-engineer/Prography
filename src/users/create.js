const mysql = require("mysql2/promise");
const config = require("../../config.js");

createUser = async function (data) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql =
      "INSERT INTO t_users(name,email,password) VALUES(?,?,?);";
    var param = [data.name, data.email, data.password];
    const [rows, fields] = await connection.query(sql, param);
    return rows.insertId;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.createUser = createUser;
