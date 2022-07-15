const mysql = require("mysql2/promise");
const config = require("../config.js");
const fs = require("fs");
const puppeteer = require("puppeteer");

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
      "INSERT INTO t_artwork (id,author_id,title,subtitle) VALUES (?,?,?,?);";
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

createThumbnail = async function (data) {
  console.log("artwork.js createThumbnail 1");
  const browser = await puppeteer.launch({
    executablePath:
      "node_modules/chromium/lib/chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium",
  });
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: 500,
      height: 500,
    });
    var url = "editor.html?user_id=" + data.user_id + ",art_id=" + data.art_id;
    console.log("http://localhost:3000/views/" + url);
    await page.goto("http://localhost:3000/views/" + url);

    const selector = await page.$("#artwork");
    await selector.screenshot({
      path: "public/image/thumbnail/" + data.art_id + ".png",
    });
    console.log("artwork.js createThumbnail 2");
  } catch (err) {
    console.log("error");
  } finally {
    await browser.close();
  }
};

getArt = async function (art_id, file_name) {
  console.log("artwork.js,getArt 1");
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
  console.log("artwork.js,getArt 2");
  return code;
};

getArtInfo = async function (art_id) {
  //console.log("artwork.js getArtInfo 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql =
      "SELECT * FROM t_artwork INNER JOIN t_user ON t_artwork.author_id = t_user.id where t_artwork.id = ?;";
    let param = [art_id];
    const [rows, fields] = await connection.query(sql, param);
    //console.log(rows);
    //console.log("artwork.js getArtInfo 2");
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

updateArt = function (art_id, file_name, data) {
  //console.log("artwork.js updateArt 1");
  switch (file_name) {
    case "html":
      fs.writeFileSync("public/artworks/html/" + art_id + ".html", data.code);
      break;
    case "scss":
      fs.writeFileSync("public/artworks/scss/" + art_id + ".scss", data.code);
      break;
    case "js":
      fs.writeFileSync("public/artworks/js/" + art_id + ".js", data.code);
      break;
  }
  //console.log("artwork.js updateArt 2");
  return 0;
};

updateInfo = async function (art_id, data) {
  //console.log("artwork.js updateInfo 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    if (data.type == "title") {
      var sql = "UPDATE t_artwork SET title=? WHERE id=?;";
    }
    if (data.type == "subtitle") {
      var sql = "UPDATE t_artwork SET subtitle=? WHERE id=?;";
    }
    let param = [data.content, art_id];
    const [rows, fields] = await connection.query(sql, param);
    //console.log("artwork.js updateInfo 2");
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

publishArt = async function (data) {
  //console.log("artwork.js,postArt 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "UPDATE t_artwork SET publish=1 WHERE id=?;";
    let param = [data.art_id];
    const [rows, fields] = await connection.query(sql, param);
    //console.log("artwork.js,postArt 2");
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

deleteCode = async function (data) {
  console.log("artwork.js deleteCode 1");
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
  console.log("artwork.js deleteCode 2");
};

deleteArt = async function (data) {
  console.log("artwork.js deleteArt 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "DELETE FROM t_artwork WHERE id = ?;";
    var param = [data.art_id];
    await connection.query(sql, param);
    console.log("artwork.js deleteArt 2");
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

deleteThumbnail = async function (data) {
  console.log("artwork.js deleteThumbnail 1");
  const path = "public/image/thumbnail/" + data.art_id + ".png";
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
  console.log("artwork.js deleteThumbnail 2");
};

exports.createCode = createCode;
exports.createArt = createArt;
exports.createThumbnail = createThumbnail;
exports.getArt = getArt;
exports.getArtInfo = getArtInfo;
exports.updateArt = updateArt;
exports.updateInfo = updateInfo;
exports.publishArt = publishArt;
exports.deleteCode = deleteCode;
exports.deleteArt = deleteArt;
exports.deleteThumbnail = deleteThumbnail;
