const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.organization_id) {
        res.redirect('/organization/home');
    } else if (req.session.normal_id) {
        res.redirect('/normal/home');
    } else {
        res.redirect('/organization/login');
    }
});

module.exports = router;