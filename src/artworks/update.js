const mysql = require("mysql2/promise");
const config = require("../../config.js");
const fs = require("fs");
const puppeteer = require("puppeteer");

updateThumbnail = async function (data) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  try {
    await page.setViewport({
      width: 500,
      height: 500,
    });
    await page.goto(
      "http://localhost:3000/artworks/html/" + data.aid + ".html"
    );
    //const selector = await page.$("#artwork");
    await page.screenshot({
      path: "public/image/thumbnail/" + data.aid + ".png",
    });
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
};

updateArt = function (data) {
  switch (data.file_name) {
    case "html":
      fs.writeFileSync(
        "public/artworks/html/" + data.aid + ".html",
        data.code
      );
      break;
    case "scss":
      fs.writeFileSync(
        "public/artworks/scss/" + data.aid + ".scss",
        data.code
      );
      break;
    case "js":
      fs.writeFileSync("public/artworks/js/" + data.aid + ".js", data.code);
      break;
  }
  return 0;
};

updateInfo = async function (data) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    if (data.type == "title") {
      var sql = "UPDATE t_artworks SET title=? WHERE id=?;";
    }
    if (data.type == "subtitle") {
      var sql = "UPDATE t_artworks SET subtitle=? WHERE id=?;";
    }
    if (data.type == "publish") {
      var sql = "UPDATE t_artworks SET publish=? WHERE id=?;";
    }
    let param = [data.content, data.aid];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
};

updateDate = async function (data) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "UPDATE t_artworks SET date=? WHERE id=?;";

    var now = new Date();
    var Year = now.getFullYear();
    var Month = now.getMonth() + 1;
    var Day = now.getDate();
    var Hour = now.getHours();
    var Min = now.getMinutes();
    var Sec = now.getSeconds();
    var date =
      Year + "-" + Month + "-" + Day + " " + Hour + ":" + Min + ":" + Sec;
    var param = [date, data.art_id];
    const [rows, fields] = await connection.query(sql, param);
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
};

exports.updateThumbnail = updateThumbnail;
exports.updateArt = updateArt;
exports.updateInfo = updateInfo;
exports.updateDate = updateDate;
