var express = require('express');
var router = express.Router();
const mysql = require("mysql2/promise");
const config = require("../../config.js");

router.get('/', function (req, res, next) {
    if (req.session.organization_id) {
        res.redirect('/organization/home');
    } else {
        res.render('organization/login', {
            title: '組織管理者ログイン'
        });
    }
});

router.post('/', async function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    let connection = null;

    try {
        connection = await mysql.createConnection(config.dbSetting);

        const query = "SELECT id FROM t_organization WHERE email = ? AND password = ? LIMIT 1";
        const d = [email, password];

        const [rows, fields] = await connection.query(query, d);

        const organization_id = rows.length ? rows[0].id : false;

        if (organization_id) {
            req.session.organization_id = organization_id;
            res.redirect('/organization/home');
        } else {
            res.render('organization/login', {
                title: '組織管理者ログイン',
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