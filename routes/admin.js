var express = require('express');
var router = express.Router();

router.all("/*", function(req, res, next) {
    req.app.locals.layout = "admin-index";
    next();
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
