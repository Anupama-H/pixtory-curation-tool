(function(_window, _AppEvent) {

    if(App.isLoginValidated) {
        _AppEvent.publish("load.page");
    } else {
        _AppEvent.subscribe("login.validated", function() {
            _AppEvent.publish("load.page");
        })
    }

    var showUserData = function() {
        /* retrieve user data from local storage */
        var user = Utils.getUser();
        if(user) {
            user.username && $(".jsUserName").html("Welcome, " + user.username);
            user.profileImage && $(".jsUserImage").html("<img src='" + user.profileImage + "' />");
        }

        /* fetch notification count data */
        Utils.makeAjaxCall("/stub-api/notification-count", "GET", {
            success: function(data) {
                $(".jsNotifCount").attr("data-count", data.count).addClass("show-count");
            }
        });
    };

    /* Show top bar user data */
    showUserData();

    /* add logout event handler */
    $(".jsLogout").on("click", Utils.logout);

})(window, AppEvent);
