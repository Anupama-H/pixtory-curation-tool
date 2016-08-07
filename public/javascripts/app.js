(function(_window, _AppEvent) {
    var App = {};

    if(App.isLoginValidated) {
        _AppEvent.publish("load.page");
    } else {
        _AppEvent.subscribe("login.validated", function() {
            // TODO : fetch user data
            _AppEvent.publish("load.page");
        })
    }

    _window.App = App;
})(window, AppEvent);
