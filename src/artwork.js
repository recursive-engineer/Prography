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
  console.log(body.file);
  console.log(body.file_name);
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    switch (body.file_name) {
      case "HTML":
        var sql = "UPDATE artwork SET html=? WHERE id=?;";
        break;
      case "JavaScript":
        var sql = "UPDATE artwork SET js=? WHERE id=?;";
        break;
      case "CSS":
        var sql = "UPDATE artwork SET css=? WHERE id=?;";
        break;
    }
    let param = [body.file, art_id];
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
