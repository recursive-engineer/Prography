const mysql = require("mysql2/promise");
const config = require("../config.js");

getArt = async function (art_id) {
  console.log("artwork.js,getArt");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM artwork WHERE id = ?;";
    let param = [art_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

updateArt = async function (art_id, body) {
  console.log("artwork.js,updateArt");
  console.log(body.html);
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "UPDATE artwork SET html=? WHERE id=?;";
    let param = [body.html, art_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.getArt = getArt;
exports.updateArt = updateArt;
