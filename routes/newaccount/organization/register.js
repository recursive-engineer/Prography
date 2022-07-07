const express = require('express');
const router = express.Router();
const mysql = require("mysql2/promise");
const config = require("../../config.js");

router.get('/', function (req, res, next) {
    if (req.session.organization_id) {
        res.redirect('/organization/home');
    } else {
        res.render('organization/register', {
            title: '新規組織登録'
        });
    }
});

router.post('/', async function (req, res, next) {
    const organizationName = req.body.organization_name;
    const email = req.body.email;
    const password = req.body.password;

    let connection = null;

    try {
        connection = await mysql.createConnection(config.dbSetting);
        const emailExistsQuery = "SELECT * FROM t_organization WHERE email = ? LIMIT 1";
        const selectData = [email];

        const registerQuery = "INSERT INTO `t_organization`(`organization_name`,`email`,`password`) VALUES(?,?,?);";
        const insertData = [organizationName, email, password];

        const [select_result, select_fields] = await connection.query(emailExistsQuery, selectData);

        const emailExists = select_result.length;

        if (emailExists) {
            res.render('organization/register', {
                title: '新規組織登録',
                emailExists: '既に登録されているメールアドレスです'
            });
        } else {
            const [insert_result, insert_fields] = await connection.query(registerQuery, insertData);
            req.session.organization_id = insert_result.insertId;
            res.redirect('/organization/login');
        }
    } catch (err) {
        console.log("エラー" + err);
    } finally {
        connection.end();
    }

});

module.exports = router;