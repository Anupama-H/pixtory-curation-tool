var express = require("express");
var router = express.Router();
var fs = require("fs");

var serveFile = function(filepath, reponse) {
    reponse.setHeader("Content-Type", "application/json");
    fs.readFile(filepath, "utf8", function (err, data) {
        if (err) throw err;
        var jsonObj = JSON.parse(data);
        reponse.send(jsonObj);
    });
};

router.get("/get-user-profile", function(req, res, next) {
    serveFile("data/user-profile.json", res);
});

router.get("/notification-count", function(req, res, next) {
    serveFile("data//notification-count.json", res);
});

router.get("/pushed-pixtories", function(req, res, next) {
    serveFile("data/pushed-pixtories.json", res);
});

router.get("/pixtory-detail", function(req, res, next) {
    serveFile("data/pixtory-detail.json", res);
});

router.get("/submitted-pixtories", function(req, res, next) {
    serveFile("data/submitted-pixtories.json", res);
});

router.get("/notifications", function(req, res, next) {
    serveFile("data/notifications.json", res);
});

module.exports = router;
