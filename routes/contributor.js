var express = require("express");
var router = express.Router();

router.all("/*", function(req, res, next) {
    req.app.locals.layout = "contributor-index";
    next();
});

/* Contributor login page */
router.get("/maplogin", function(req, res, next) {
  res.render("contributor/login", {
      "page": "MAP"
  });
});

module.exports = router;
