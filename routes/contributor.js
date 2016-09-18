var express = require("express");
var router = express.Router();

router.all("/*", function(req, res, next) {
    req.app.locals.layout = "contributor-index";
    next();
});

/* Contributor login page */
router.get("/login", function(req, res, next) {
  res.render("contributor/login", {
      "page": "LOGIN"
  });
});

/* GET create pixtory page */
router.get("/create", function(req, res, next) {
  res.render("contributor/create-pixtory", {
      "page": "CREATE"
  });
});

/* GET Pixtories pushed into app */
router.get("/pushedPixtories", function(req, res, next) {
  res.render("contributor/pixtory-pushed", {
      "page": "PUSHED"
  });
});

/* GET All submitted Pixtories */
router.get("/submittedPixtories", function(req, res, next) {
  res.render("contributor/pixtory-submitted", {
      "page": "SUBMITTED"
  });
});

/* GET All Notifictaions */
router.get("/notifications", function(req, res, next) {
  res.render("contributor/notifications", {
      "page": "NOTIF"
  });
});

/* GET Profile Page */
router.get("/profile", function(req, res, next) {
  res.render("contributor/profile", {
      "page": "PROFILE",
      "hideLeftNav": true
  });
});

/* GET FAQ Page */
router.get("/faq", function(req, res, next) {
  res.render("contributor/faq", {
      "page": "FAQ",
      "hideLeftNav": true
  });
});


module.exports = router;
