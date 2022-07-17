const mysql = require("mysql2/promise");
const config = require("../config.js");

getMyArts = async function (user_id) {
  console.log("user.js getArts");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM t_artwork WHERE author_id = ?;";
    let param = [user_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.getMyArts = getMyArts;
