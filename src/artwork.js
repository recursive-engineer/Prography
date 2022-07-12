const mysql = require("mysql2/promise");
const config = require("../config.js");
const fs = require("fs");
const puppeteer = require("puppeteer");

createThumbnail = async function (art_id) {
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
    //await page.goto("//" + window.location.host + "/views/artwork.html");
    await page.goto("http://localhost:3000/views/artwork.html");
    await page.screenshot({
      path: "public/image/thumbnail/" + art_id + ".png",
    });
  } catch (err) {
    console.log("error");
  } finally {
    await browser.close();
  }
  console.log("artwork.js createThumbnail 2");
};

updateArt = function (art_id, file_name, data) {
  console.log("artwork.js updateArt 1");
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
  console.log("artwork.js updateArt 2");
  return 0;
};

publishArt = async function (art_id) {
  console.log("artwork.js,postArt 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    var sql = "UPDATE artwork SET publish=1 WHERE id=?;";
    let param = [art_id];
    const [rows, fields] = await connection.query(sql, param);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    connection.end();
  }
  console.log("artwork.js,postArt 2");
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

copyCode = async function (art_id) {
  var html = fs.readFileSync(
    "public/artworks/html/" + art_id + ".html",
    "utf-8"
  );
  var scss = fs.readFileSync(
    "public/artworks/scss/" + art_id + ".scss",
    "utf-8"
  );
  var js = fs.readFileSync("public/artworks/js/" + art_id + ".js", "utf-8");
  fs.writeFileSync("public/views/artwork.html", html);
  fs.writeFileSync("public/views/artwork.scss", scss);
  fs.writeFileSync("public/views/artwork.js", js);
};

exports.getArt = getArt;
exports.updateArt = updateArt;
exports.publishArt = publishArt;
exports.copyCode = copyCode;
exports.createThumbnail = createThumbnail;
