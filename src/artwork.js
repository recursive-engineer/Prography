const mysql = require("mysql2/promise");
const config = require("../config.js");
const fs = require("fs");
const puppeteer = require("puppeteer");

updateThumbnail = async function (data) {
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
    console.log("http://54.238.179.114:3000/views/" + url);
    await page.goto("http://54.238.179.114:3000/views/" + url);
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
      "SELECT * FROM t_artwork INNER JOIN t_user ON t_artwork.author_id = t_user.user_id where t_artwork.art_id = ?;";
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

updateArt = function (data) {
  //console.log("artwork.js updateArt 1");
  switch (data.file_name) {
    case "html":
      fs.writeFileSync(
        "public/artworks/html/" + data.art_id + ".html",
        data.code
      );
      break;
    case "scss":
      fs.writeFileSync(
        "public/artworks/scss/" + data.art_id + ".scss",
        data.code
      );
      break;
    case "js":
      fs.writeFileSync("public/artworks/js/" + data.art_id + ".js", data.code);
      break;
  }
  //console.log("artwork.js updateArt 2");
  return 0;
};

updateInfo = async function (data) {
  //console.log("artwork.js updateInfo 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    if (data.type == "title") {
      var sql = "UPDATE t_artwork SET title=? WHERE art_id=?;";
    }
    if (data.type == "subtitle") {
      var sql = "UPDATE t_artwork SET subtitle=? WHERE art_id=?;";
    }
    if (data.type == "publish") {
      var sql = "UPDATE t_artwork SET publish=? WHERE art_id=?;";
    }
    let param = [data.content, data.art_id];
    const [rows, fields] = await connection.query(sql, param);
    //console.log("artwork.js updateInfo 2");
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
};

updateDate = async function (data) {
  //console.log("artwork.js updateDate 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "UPDATE t_artwork SET date=? WHERE art_id=?;";

    var now = new Date();
    var Year = now.getFullYear();
    var Month = now.getMonth() + 1;
    var Day = now.getDate();
    var Hour = now.getHours();
    var Min = now.getMinutes();
    var Sec = now.getSeconds();
    var date =
      Year + "-" + Month + "-" + Day + " " + Hour + ":" + Min + ":" + Sec;
    console.log(date);
    var param = [date, data.art_id];
    const [rows, fields] = await connection.query(sql, param);
    //console.log("artwork.js updateDate 2");
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
    var sql = "DELETE FROM t_artwork WHERE art_id = ?;";
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

exports.getArt = getArt;
exports.getArtInfo = getArtInfo;

exports.updateThumbnail = updateThumbnail;
exports.updateArt = updateArt;
exports.updateInfo = updateInfo;
exports.updateDate = updateDate;

exports.deleteCode = deleteCode;
exports.deleteArt = deleteArt;
exports.deleteThumbnail = deleteThumbnail;
