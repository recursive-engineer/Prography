const express = require('express');
const router = express.Router();
const mysql = require("mysql2/promise");
const config = require("../../config.js");

router.get('/', async function (req, res, next) {
    if (req.session.normal_id) {

        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = ("0" + (date.getMonth() + 1)).slice(-2);
        const dd = ("0" + date.getDate()).slice(-2);
        const current = yyyy + '-' + mm + '-' + dd;

        const listNormal = await getListNormals(req.session.normal_id);
        // console.log(listOrganization);
        // const listTasks = await list.getListTasks();

        console.log(listNormal);
        res.render('normal/home', {
            title: 'ユーザホーム',
            nid: req.session.normal_id,
            category: listNormal.categories,
            task: listNormal.tasks,
            current: current
        });
    } else {
        res.redirect('login');
    }
});

//ユーザーアカウントidの取得
getListNormals = async function (id) {
    let connection = null;
    try {
        connection = await mysql.createConnection(config.dbSetting);
        const sql =
            `SELECT t_task.* FROM t_task
                LEFT JOIN  t_task_management ON t_task.id = t_task_management.task_id
                INNER JOIN t_user_management ON t_task_management.user_management_id = t_user_management.id
            WHERE t_user_management.user_id = ?`;
        let d = [id];
        const [tasks, fields] = await connection.query(sql, d);

        const sql2 = "SELECT * FROM m_category";
        d = [];
        const [categories, fields2] = await connection.query(sql2, d);
        const list = { tasks: tasks, categories: categories };
        return list;
    } catch (err) {
        console.log(err);
    } finally {
        connection.end();
    }
};

module.exports = router;