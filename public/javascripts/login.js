(function(_window, _AppEvent) {
    var onLoginSuccess = function(params) {
        Utils.makeAjaxCall("/stub-api/get-user-profile?" + $.param(params) , function(data) {

            /* store user data in localstorage */
            if(localStorage) {
                localStorage.setItem("userData", JSON.stringify(data));
            }

            /* redirect to init page */
            _window.location.href = "/contributor/pushedPixtories";

        }, Utils.showError);
    };

    var onLoginFailure = function() {
        _window.location.href = "/contributor/login";
    };

    var addFbLoginHandler = function() {
        $(".jsLoginFb").on("click", function() {
            FB.login(function(response) {
                if (response.status === "connected") {
                    console.log("accessToken : " + response.authResponse.accessToken);
                    console.log("userId : " + response.authResponse.userID);
                    Cookies.set("loginStrategy", "fb");
                    onLoginSuccess({loginStrategy: "fb",id: response.authResponse.userID});
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
                onLoginSuccess({loginStrategy: "google",id: googleAuth.currentUser.get().getId()});
            });
        });
    };

    _AppEvent.subscribe("google.init", addGoogleLoginHandler);
    _AppEvent.subscribe("fb.init", addFbLoginHandler);
})(window, AppEvent);
