var express = require("express");
var router = express.Router();

router.all("/*", function(req, res, next) {
    req.app.locals.layout = "contest-index";
    next();
});

/* GET create pixtory page */
router.get("/create", function(req, res, next) {
  res.render("contest/create-pixtory", {
      "page": "CREATE"
  });
});

module.exports = router;
