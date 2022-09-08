const mysql = require("mysql2/promise");
const config = require("../config.js");

getArts = async function () {
  //console.log("user.js getArts 1");
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    const sql =
      "SELECT * FROM t_artwork INNER JOIN t_user ON t_artwork.author_id = t_user.user_id WHERE t_artwork.publish = 1 ORDER BY t_artwork.date DESC;";
    const [rows, fields] = await connection.query(sql);
    //console.log("user.js getArts 2");
    //console.log(rows);
    return rows;
  } catch (err) {
    //console.log(err);
  } finally {
    connection.end();
  }
};

exports.getArts = getArts;
