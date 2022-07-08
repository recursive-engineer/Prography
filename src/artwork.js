const mysql = require("mysql2/promise");
const config = require("../config.js");
const fs = require("fs");
const puppeteer = require("puppeteer");

getThumbnail = async function (art_id) {
  const browser = await puppeteer.launch({
    executablePath:
      "node_modules/chromium/lib/chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium",
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://techblog.zozo.com/entry/puppeteer");
    await page.screenshot({ path: "public/image/thumbnail/screenshot.png" });
  } catch (err) {
    console.log("error");
  } finally {
    await browser.close();
  }
};

writeCode = function (response) {
  console.log("artwork.js,writeCode");
  const head = fs.readFileSync("public/views/artwork-head.txt", "utf-8");
  const tail = fs.readFileSync("public/views/artwork-tail.txt", "utf-8");
  const html = response[0].html;
  const css = response[0].css;
  const js = response[0].js;
  try {
    fs.writeFileSync("public/views/artwork.html", head);
    fs.appendFileSync("public/views/artwork.html", html);
    fs.appendFileSync("public/views/artwork.html", tail);
    console.log("HTMLが正常に書き込み完了しました");
  } catch (e) {
    console.log(e.message);
  }
  try {
    fs.writeFileSync("public/scss/artwork.scss", css);
    console.log("CSSが正常に書き込み完了しました");
  } catch (e) {
    console.log(e.message);
  }
  try {
    fs.writeFileSync("public/js/artwork.js", js);
    console.log("JavaScriptが正常に書き込み完了しました");
  } catch (e) {
    console.log(e.message);
  }
};

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

exports.writeCode = writeCode;
exports.getArt = getArt;
exports.updateArt = updateArt;
exports.getThumbnail = getThumbnail;
