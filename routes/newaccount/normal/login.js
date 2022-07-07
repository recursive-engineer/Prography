var express = require('express');
var router = express.Router();
const mysql = require("mysql2/promise");
const config = require("../../config.js");

router.get('/', function (req, res, next) {
    if (req.session.normal_id) {
        res.redirect('/normal/home');
    } else {
        res.render('normal/login', {
            title: '一般ユーザログイン'
        });
    }
});
//ログイン機能
router.post('/', async function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    let connection = null;
    //パスワードとメールアドレスが一致するnormalユーザーidの取得
    try {
        connection = await mysql.createConnection(config.dbSetting);

        const query = "SELECT id FROM t_user WHERE email = ? AND password = ? LIMIT 1";
        const d = [email, password];

        const [rows, fields] = await connection.query(query, d);

        const normal_id = rows.length ? rows[0].id : false;

        if (normal_id) {
            req.session.normal_id = normal_id;
            res.redirect('/normal/home');
        } else {
            res.render('normal/login', {
                title: '一般ユーザログイン',
                noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
            });
        }
    } catch (err) {
        console.log("エラー" + err);
    } finally {
        connection.end();
    }
});

module.exports = router;