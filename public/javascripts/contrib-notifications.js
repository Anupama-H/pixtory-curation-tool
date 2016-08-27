(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var notificationsElem = $(".jsNotifications");

        var showNotifications = function(data) {
            notificationsElem.render("contrib-notifications", data);
        };

        /* Fetch the list of notifications */
        Utils.makeAjaxCall("/stub-api/notifications", "GET", {
            success: showNotifications,
            error: Utils.showError
        });
    });
})(AppEvent);
