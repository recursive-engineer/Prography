const mysql = require("mysql2/promise");
const config = require("../../config.js");
const fs = require("fs");

getArt = async function (art_id, file_name) {
  switch (file_name) {
    case "html":
      var code = fs.readFileSync(
        "public/artworks/html/" + art_id + ".html",
        "utf-8"
      );
      break;
    case "scss":
      var code = fs.readFileSync(
        "public/artworks/scss/" + art_id + ".scss",
        "utf-8"
      );
      break;
    case "js":
      var code = fs.readFileSync(
        "public/artworks/js/" + art_id + ".js",
        "utf-8"
      );
      break;
  }
  return code;
};

getArtInfo = async function (art_id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql =
      "SELECT * FROM t_artworks INNER JOIN t_users ON t_artworks.author_id = t_users.id where t_artworks.id = ?;";
    let param = [art_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
};

gallery = async function () {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql =
      "SELECT * FROM t_users INNER JOIN t_artworks ON t_artworks.author_id = t_users.id WHERE t_artworks.publish = 1 ORDER BY t_artworks.date DESC;";
    const [rows, fields] = await connection.query(sql);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
};

mypage = async function (user_id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM t_artworks WHERE author_id = ?;";
    let param = [user_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
};

exports.mypage = mypage;
exports.gallery = gallery;
exports.getArt = getArt;
exports.getArtInfo = getArtInfo;
