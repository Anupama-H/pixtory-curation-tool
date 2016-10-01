(function(Handlebars) {
    var Utils = {};

    Utils.dataURItoBlob = function(dataURI) {
        /* convert base64/URLEncoded data component to raw binary data held in a string */
        var byteString,
            dataURIArray = dataURI.split(",");

        if (dataURIArray[0].indexOf("base64") >= 0) {
            byteString = atob(dataURIArray[1]);
        } else {
            byteString = unescape(dataURIArray[1]);
        }

        /* separate out the mime component */
        var mimeString = dataURIArray[0].split(":")[1].split(";")[0];

        /* write the bytes of the string to a typed array */
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    };

    Utils.scrollToElement = function(element) {
        var offset = element.offset();
        $("body").animate({
            scrollTop: offset.top,
            scrollLeft: offset.left
        });
    };

    Utils.getUser = function() {
        if(localStorage) {
            var user = localStorage.getItem("userData");
            if(user) {
                return JSON.parse(user);
            }
        }
        return false;
    };

    Utils.makeAjaxCall = function(url, method, callbacks, requestParams) {
        var successCallback = callbacks && callbacks.success,
            errorCallback = callbacks && callbacks.error;

        var ajaxOptions = {
            type: method,
            url: url,
            contentType : "application/json"
        };

        if(requestParams) {
            if(method === "POST") {
                ajaxOptions["processData"] = false;
                if(Object.prototype.toString.call(requestParams) === "[object FormData]") {
                    /* do not set any contentType for form data */
                    ajaxOptions["contentType"] = false;
                }
            }
            ajaxOptions["data"] = requestParams;
        }

        $.ajax(ajaxOptions).done(function(serverData) {
            if(serverData && serverData.diagnostics && serverData.diagnostics.errorMessage) {
                errorCallback && errorCallback(serverData.diagnostics.errorMessage);
            } else {
                successCallback(serverData.data);
            }
        }).fail(function(xhr, textStatus, errorThrown) {
            console.error("ERROR : " + errorThrown);
            errorCallback && errorCallback(textStatus);
        });
    };

    Utils.showMessage = function(obj) {
        var type = obj.type || "info",
            message = obj.message,
            hide = obj.hide;

        var messageElement = $(".jsMessage");

        messageElement.addClass("msg-" + type).html(message).show();
        if(hide) {
            messageElement.delay(3000).hide();
        }
    };

    Utils.clearMessages = function() {
        $(".jsMessage").hide().html("");
        $(".jsMessage").removeClass("msg-error msg-success");
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

        var logoutUser = function() {

            Utils.makeAjaxCall(App.apiEndPoint + "/contributor/logout", "GET", {
                success: function() {
                    /* delete cookies */
                    Cookies.remove("loginStrategy");

                    /* delete localstorage content */
                    localStorage.clear();

                    /* redirect to login page */
                    window.location.href = App.logoutRedirect;
                },
                error: function(errorMessage) {
                    Utils.showMessage({
                        type: "error",
                        message: errorMessage
                    });
                }
            });
        };

        /* logout from social networks */
        if(loginStrategy === "google") {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(logoutUser);
        } else {
            logoutUser();
        }
    };

    Utils.showModal = function(options) {
        var $modal = $(".jsModal"),
            modalElement = $modal.length ? $modal : $("<div class='modal jsModal'><div class='m-box jsModalBox'><div class='clearfix'><span class='m-close jsModalClose'>&#10005;</span></div><div class='m-cont jsModalCont'></div></div></div>");

        var hideModal = function(event) {
            event.stopPropagation();
            var targetElement = $(event.target);
            if(targetElement.hasClass("jsModal") || targetElement.hasClass("jsModalClose")) {
                modalElement.hide();
                $(".jsModalCont").html("");
            }
        };

        if(!$modal.length) {
            $("body").append(modalElement);
            /* setup close handlers */
            modalElement.on("click", hideModal);
            $(".jsModalClose").on("click", hideModal);
        } else {
            modalElement.show();
        }

        if(options.template) {
            $(".jsModalCont").render(options.template, options.data);
        } else {
            $(".jsModalCont").html(options.templateString);
        }
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

    Handlebars.registerHelper("ifEqual", function (val1, val2, obj) {
        if (val1 === val2) {
            return obj.fn(this);
        }
        else if (obj.inverse) {
            return obj.inverse(this);
        }
    });

    /* Handlebars Helpers END */

    window.Utils = Utils;
})(Handlebars);
