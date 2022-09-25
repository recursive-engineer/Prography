const mysql = require("mysql2/promise");
const config = require("../../config.js");
const fs = require("fs");

deleteCode = async function (data) {
  const html_path = "public/artworks/html/" + data.art_id + ".html";
  const scss_path = "public/artworks/scss/" + data.art_id + ".scss";
  const js_path = "public/artworks/js/" + data.art_id + ".js";
  if (fs.existsSync(html_path)) {
    fs.unlinkSync(html_path);
  }
  if (fs.existsSync(scss_path)) {
    fs.unlinkSync(scss_path);
  }
  if (fs.existsSync(js_path)) {
    fs.unlinkSync(js_path);
  }
};

deleteArt = async function (data) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "DELETE FROM t_artwork WHERE art_id = ?;";
    var param = [data.art_id];
    await connection.query(sql, param);
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

deleteThumbnail = async function (data) {
  const path = "public/image/thumbnail/" + data.art_id + ".png";
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

exports.deleteCode = deleteCode;
exports.deleteArt = deleteArt;
exports.deleteThumbnail = deleteThumbnail;
