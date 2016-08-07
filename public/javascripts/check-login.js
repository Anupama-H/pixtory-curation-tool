(function(_window, _AppEvent, _App) {
    var loginStrategy = Cookies.get("loginStrategy");

    var logout = function() {
        /* delete cookies */
        Cookies.remove("loginStrategy");

        /* redirect to login page */
        _window.location.href = "/contributor/login";
    };

    var fbSigninChanged = function(response) {
        if(response.status === "connected") {
            console.log("user is logged in");
            console.log("accessToken : " + response.authResponse.accessToken);
            console.log("userId : " + response.authResponse.userID);
        } else {
            logout();
        }
    };

    var googleSigninChanged = function(isSignedIn) {
        if(!isSignedIn) {
            /* redirect to login page */
            logout();
        }
    };

    var verifyFbLogin = function() {
        /* Get the current FB Login status */
        FB.getLoginStatus(function(response) {
            if(response.status === "connected") {
                _App.isLoginValidated = true;
                _AppEvent.publish("login.validated");
            }
            fbSigninChanged(response);
        });

        /* Listen for Facebook sign-in state changes */
        FB.Event.subscribe("auth.statusChange", fbSigninChanged);
    };

    var verifyGoogleLogin = function() {
        var auth2 = gapi.auth2.getAuthInstance();

        /* Get the current Google login status */
        if(auth2.isSignedIn.get()) {
            _App.isLoginValidated = true;
            _AppEvent.publish("login.validated");
        } else {
            logout();
        }

        /* Listen for Google sign-in state changes */
        auth2.isSignedIn.listen(googleSigninChanged);
    };

    if(loginStrategy === "google") {
        _AppEvent.subscribe("google.init", verifyGoogleLogin);
    } else if(loginStrategy === "fb") {
        _AppEvent.subscribe("fb.init", verifyFbLogin);
    } else {
        logout();
    }

})(window, AppEvent, App);
