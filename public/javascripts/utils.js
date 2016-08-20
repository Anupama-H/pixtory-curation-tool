(function(Handlebars) {
    var Utils = {};

    Utils.getUser = function() {
        if(localStorage) {
            var user = localStorage.getItem("userData");
            if(user) {
                return JSON.parse(user);
            }
        }
        return false;
    };

    Utils.makeAjaxCall = function(url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            dataType: "json"
        }).done(function(serverData) {
            if(serverData && serverData.diagnostics && Object.keys(serverData.diagnostics.error).length) {
                errorCallback && errorCallback(serverData.diagnostics.error.message);
            } else {
                successCallback(serverData.data);
            }
        }).fail(function(xhr, textStatus, errorThrown) {
            console.err("ERROR : " + errorThrown);
            errorCallback && errorCallback(textStatus);
        });
    };

    Utils.showError = function(message) {
        $(".jsError").html(message).show();
    };

    Utils.clearErrors = function() {
        $(".jsError").hide().html("");
    };

    Utils.getQueryParameter= function(param) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] == param){
                return pair[1];
            }
        }
        return false;
    };

    Utils.clearQueryParam = function() {
        if (history.pushState) {
            var newurl = window.location.origin + window.location.pathname;
            window.history.pushState({path:newurl},"",newurl);
        }
    };

    Utils.addQueryParam = function(obj) {
        if (history.pushState) {
            var newurl = window.location.origin + window.location.pathname + "?" + $.param(obj);
            window.history.pushState({path:newurl}, "", newurl);
        }
    };

    Utils.logout = function() {
        var loginStrategy = Cookies.get("loginStrategy");

        var onLogout = function() {
            // TODO : call /contributor/logout API

            /* redirect to login page */
            window.location.href = "/contributor/login";
        };

        /* logout from social networks */
        if(loginStrategy === "google") {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(onLogout);
        } else if(loginStrategy === "fb") {
            FB.logout(onLogout);
        } else {
            onLogout();
        }

        /* delete cookies */
        Cookies.remove("loginStrategy");

        /* delete localstorage content */
        localStorage.clear();
    };

    /* Handlebars Helpers */
    Handlebars.registerHelper("for", function(from, to, incr, block) {
        var accum = "";
        for(var i = from; i < to; i += incr) {
            accum += block.fn({
                data: this[i],
                index: i
            });
        }
        return accum;
    });

    Handlebars.registerHelper("ifModuloEqual", function(num1, num2, value, options) {
        var fn = options.fn, inverse = options.inverse;
        num1 = +num1;
        num2 = +num2;
        value = +value;
        if ((num1 % num2) === value){
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper("ifModuloPlusEqual", function(num1, num2, value, options) {
        var fn = options.fn, inverse = options.inverse;
        num1 = +(num1 + 1);
        num2 = +num2;
        value = +value;
        if ((num1 % num2) === value){
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /* Handlebars Helpers END */

    window.Utils = Utils;
})(Handlebars);
