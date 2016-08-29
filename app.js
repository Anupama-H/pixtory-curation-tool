var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var contributorRoutes = require("./routes/contributor");
var adminRoutes = require("./routes/admin");
var contestRoutes = require("./routes/contest");
var app = express();
var packageJson = require("./package.json");

// view engine setup
app.set("views", path.join(__dirname, "views"));

// Use handlebar for templates
var exphbs = require("express-handlebars");
app.engine(".hbs", exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    helpers: {
        ifEqual: function (val1, val2, obj) {
            if (val1 === val2) {
                return obj.fn(this);
            }
            else if (obj.inverse) {
                return obj.inverse(this);
            }
        },
        ifNotEqual: function (val1, val2, obj) {
            if (val1 !== val2) {
                return obj.fn(this);
            }
            else if (obj.inverse) {
                return obj.inverse(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* set up contributor, admin and contest routes */
app.use("/contributor", contributorRoutes);
app.use("/admin", adminRoutes);
app.use("/contest", contestRoutes);

/* Commenting out stub-api on only dev mode for now
if (app.get("env") === "development") { */
    //TODO :: To be removed, only for testing purposes
    var apiRoutes = require("./routes/stub-apis");
    app.use("/stub-api", apiRoutes);
//}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: err,
        layout: false
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

/* set the App config data */
app.locals = {
    mode: app.get("env"),
    assetVersion: packageJson.version
};


module.exports = app;
