// 新規登録処理
const mysql = require("mysql2/promise");
const config = require("../config.js");

checkUser = async function (data) {
  let connection = null;
  try {
    //console.log("user.js checkUser 1");
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM t_user WHERE email = ?;";
    const [rows, fields] = await connection.query(sql, data.email);
    var result = 0;
    if (rows.length != 0) {
      result = 1;
    }
    //console.log(result);
    //console.log("user.js checkUser 2");
    return result;
  } catch (err) {
    //console.log(err);
  } finally {
    connection.end();
  }
};

createUser = async function (data) {
  let connection = null;
  try {
    //console.log("user.js createUser 1");
    connection = await mysql.createConnection(config.dbSetting);
    const sql1 = "SELECT * FROM t_user;";
    const [rows1, fields1] = await connection.query(sql1);
    console.log(rows1);
    if (rows1.length == 0) {
      var min = 1;
    } else {
      var min = minValue(rows1);
    }
    function minValue(rows1) {
      for (var i = 1; i < rows1.length + 2; i++) {
        for (var j = 0; j < rows1.length; j++) {
          if (rows1[j].user_id == i) {
            break;
          } else if (j == rows1.length - 1) {
            return i;
          }
        }
      }
    }
    const sql2 =
      "INSERT INTO `t_user`(`user_id`,`name`,`email`,`password`) VALUES(?,?,?,?);";
    var param = [min, data.name, data.email, data.password];
    console.log(param);

    const [rows2, fields2] = await connection.query(sql2, param);
    console.log(rows2);
    //console.log("user.js createUser 2");
    return min;
  } catch (err) {
    //console.log(err);
  } finally {
    connection.end();
  }
};

getUserInfo = async function (user_id) {
  let connection = null;
  try {
    //console.log("user.js getUser 1");
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM t_user WHERE user_id = ?;";
    var param = [user_id];
    const [rows, fields] = await connection.query(sql, param);
    //console.log(rows);
    //console.log("user.js getUser 2");
    return rows;
  } catch (err) {
    //console.log(err);
  } finally {
    connection.end();
  }
};

signUser = async function (data) {
  let connection = null;
  try {
    //console.log("user.js getUser 1");
    connection = await mysql.createConnection(config.dbSetting);
    const sql = "SELECT * FROM t_user WHERE email = ?;";
    var param = [data.email];
    const [rows, fields] = await connection.query(sql, param);
    var user_id = 0;
    if (rows[0].password == data.password) {
      user_id = rows[0].user_id;
    }
    //console.log(rows);
    return user_id;
  } catch (err) {
    //console.log(err);
  } finally {
    connection.end();
  }
};

exports.checkUser = checkUser;
exports.createUser = createUser;
exports.getUserInfo = getUserInfo;
exports.signUser = signUser;
