const mysql = require("mysql2/promise");
const config = require("../config.js");
const fs = require("fs");

createCode = async function (art_id) {
  var html =
    '<script src="../artworks/js/' +
    art_id +
    '.js"></script>\n<link rel="stylesheet" href="../artworks/scss/' +
    art_id +
    '.css" media="screen" type="text/css"/>';
  var scss = "";
  var js = "";
  const html_path = "public/artworks/html/" + art_id + ".html";
  const scss_path = "public/artworks/scss/" + art_id + ".scss";
  const js_path = "public/artworks/js/" + art_id + ".js";
  fs.writeFileSync(html_path, html);
  fs.writeFileSync(scss_path, scss);
  fs.writeFileSync(js_path, js);
  var html_exist = 0;
  var scss_exist = 0;
  var js_exist = 0;
  if (fs.existsSync(html_path)) {
    html_exist = 1;
  }
  if (fs.existsSync(scss_path)) {
    scss_exist = 1;
  }
  if (fs.existsSync(js_path)) {
    js_exist = 1;
  }

  return html_exist * scss_exist * js_exist;
};

createArt = async function (user_id) {
  //console.log("artwork.js createNewCode 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql1 = "SELECT id FROM t_artwork;";
    var sql2 =
      "INSERT INTO t_artwork (art_id,author_id,title,subtitle) VALUES (?,?,?,?);";
    var [rows, fields] = await connection.query(sql1);
    console.log();
    if (rows.length == 0) {
      var min = 1;
    } else {
      var min = minValue(rows);
    }
    function minValue(rows) {
      for (var i = 1; i < rows.length + 2; i++) {
        for (var j = 0; j < rows.length; j++) {
          if (rows[j].id == i) {
            break;
          } else if (j == rows.length - 1) {
            return i;
          }
        }
      }
    }
    var param = [min, user_id, "タイトル", "subtitle"];
    await connection.query(sql2, param);
    //console.log("artwork.js createNewCode 2");
    return min;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

exports.createCode = createCode;
exports.createArt = createArt;
