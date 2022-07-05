const mysql = require("mysql2/promise");
const config = require("../config.js");

getArt = async function (art_id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM artwork WHERE id = 1;";
    let param = [art_id];
    const [rows, fields] = await connection.query(sql);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.getArt = getArt;
