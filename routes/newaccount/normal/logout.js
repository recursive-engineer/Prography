var express = require('express');
var router = express.Router();
//ログアウト機能
router.get('/', function (req, res, next) {
    req.session.destroy();
    res.redirect('/normal/login');
});

module.exports = router;