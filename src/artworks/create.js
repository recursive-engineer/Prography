const mysql = require("mysql2/promise");
const config = require("../../config.js");
const fs = require("fs").promises;

createCode = async function (art_id) {
  try {
    const html =
      '<script src="/artworks/js/' +
      art_id +
      '.js"></script>\n<link rel="stylesheet" href="/artworks/css/' +
      art_id +
      '.css" media="screen" type="text/css"/>';
    const scss = "";
    const css = "";
    const js = "";
    const html_path = "public/artworks/html/" + art_id + ".html";
    const scss_path = "public/artworks/scss/" + art_id + ".scss";
    const css_path = "public/artworks/css/" + art_id + ".css";
    const js_path = "public/artworks/js/" + art_id + ".js";
    await fs.writeFile(html_path, html);
    await fs.writeFile(scss_path, scss);
    await fs.writeFile(css_path, css);
    await fs.writeFile(js_path, js);
  } catch (error) {
    console.error(error);
  }
};

createArt = async function (user_id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "INSERT INTO t_artworks(author_id) VALUES (?);";
    const [rows, fields] = await connection.query(sql, user_id);
    return rows.insertId;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
};

exports.createCode = createCode;
exports.createArt = createArt;
