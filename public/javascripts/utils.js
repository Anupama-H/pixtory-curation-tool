(function(Handlebars) {
    var Utils = {};

    Utils.makeAjaxCall = function(url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            dataType: "json"
        }).done(function(serverData) {
            if(serverData && serverData.diagnostics && Object.keys(serverData.diagnostics.error).length) {
                errorCallback(serverData.diagnostics.error.message);
            } else {
                successCallback(serverData.data);
            }
        }).fail(function(xhr, textStatus, errorThrown) {
            console.err("ERROR : " + errorThrown);
            errorCallback(textStatus);
        });
    };

    Utils.showError = function(message) {
        $(".jsError").html(message).show();
    };

    Utils.clearErrors = function() {
        $(".jsError").hide().html("");
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
