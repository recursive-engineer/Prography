var express = require("express");
var router = express.Router();
const che = require("../../src/users/check.js");

router.post('/', async function (req, res, next) {
  let empty = 1;

  const email = req.body.email;
  const password = req.body.password;
  const data = {
    email: email,
    password: password,
  };

  if (email != "" && password != "") {
    empty = 0;
  } else {
    empty = 1;
  }

  if (empty != 0) {
    res.render('/gallery', {
      err_message: '未入力の項目があります'
    });
  } else {
    const response = await che.checkPass(data);
    if (response[0].id == 0) {
      res.render('/gallery', {
        err_message: 'メールアドレスまたはパスワードが間違っています'
      });
    }else{
      req.session.uid = response[0].id;
      res.redirect('/gallery');
    }
  }
});

module.exports = router;