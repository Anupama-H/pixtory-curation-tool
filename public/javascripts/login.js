(function(_window, _AppEvent) {
    var onLoginSuccess = function() {
        _window.location.href = "/contributor/pushedPixtories";
    };

    var onLoginFailure = function() {
        _window.location.href = "/contributor/login";
    };

    var addFbLoginHandler = function() {
        $(".jsLoginFb").on("click", function() {
            FB.login(function(response) {
                if (response.status === "connected") {
                    console.log("user is logged in");
                    console.log("accessToken : " + response.authResponse.accessToken);
                    console.log("userId : " + response.authResponse.userID);
                    Cookies.set("loginStrategy", "fb");
                    onLoginSuccess();
                } else {
                    onLoginFailure();
                }
            });
        });
    };

    var addGoogleLoginHandler = function() {
        $(".jsLoginGoogle").on("click", function() {
            var googleAuth = gapi.auth2.getAuthInstance();
            googleAuth.signIn().then(function() {
                console.log("User ID : " + googleAuth.currentUser.get().getId());
                Cookies.set("loginStrategy", "google");
                onLoginSuccess();
            });
        });
    };

    _AppEvent.subscribe("google.init", addGoogleLoginHandler);
    _AppEvent.subscribe("fb.init", addFbLoginHandler);
})(window, AppEvent);
