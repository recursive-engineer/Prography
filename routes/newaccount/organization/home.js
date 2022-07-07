const express = require('express');
const router = express.Router();
const o_list = require("../../src/organization/list.js");


router.get('/', async function (req, res, next) {
    if (req.session.organization_id) {

        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = ("0" + (date.getMonth() + 1)).slice(-2);
        const dd = ("0" + date.getDate()).slice(-2);
        const current = yyyy + '-' + mm + '-' + dd;

        const listOrganization = await o_list.getListOrganizations(req.session.organization_id);
        console.log(listOrganization);

        res.render('organization/home', {
            title: '管理者ホーム',
            oid: req.session.organization_id,
            o_users: listOrganization.ousers,
            tasks: listOrganization.tasks,
            categories: listOrganization.categories,
            current: current
        });
    } else {
        res.redirect('login');
    }
});


module.exports = router;