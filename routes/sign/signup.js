var express = require("express");
var router = express.Router();
const che = require("../../src/users/check.js");
const cre = require("../../src/users/create.js");

router.post('/', async function (req, res, next) {
  let empty = 1;
  let result = 0;

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    name: name,
    email: email,
    password: password,
  };

  if (name != "" && email != "" && password != "") {
    empty = 0;
  } else {
    empty = 1;
  }

  result = await che.checkUser(data);

  if (result != 0) {
    res.render('/gallery', {
      err_message: '登録済みのユーザー情報が含まれています'
    });
  }
  if (empty != 0) {
    res.render('/gallery', {
      err_message: '未入力の項目があります'
    });
  }
  if (result == 0 && empty == 0) {
    const uid = await cre.createUser(data);
    req.session.uid = uid;
    res.redirect('/gallery');
  }
});

module.exports = router;