var express = require("express");
var router = express.Router();

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

module.exports = router;
