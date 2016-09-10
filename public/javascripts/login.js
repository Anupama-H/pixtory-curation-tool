(function(_window, _AppEvent) {
    var onLoginSuccess = function(params) {

//        Utils.makeAjaxCall(App.apiEndPoint + "/contributor/register", "POST", , JSON.stringify(params));

//        Utils.makeAjaxCall("/portal/stub-api/get-user-profile?" + $.param(params) , "GET", {
        Utils.makeAjaxCall(App.apiEndPoint + "/contributor/register", "POST", {
            success: function(data) {

                /* store user data in localstorage */
                if(localStorage) {
                    localStorage.setItem("userData", JSON.stringify(data));
                }

                /* redirect to init page */
                _window.location.href = App.loginRedirect;

            },
            error: function(errorMessage) {
                Utils.showMessage({
                    type: "error",
                    message: errorMessage
                });
            }
        }, JSON.stringify(params));
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
                    FB.api("/" + response.authResponse.userID, {fields: "name,email,picture"}, function(response) {
                        onLoginSuccess({loginStrategy: "fb", fbId: response.id, userName: response.name, userEmail: response.email, userImageUrl: response.picture.data.url});
                    });

                } else {
                    onLoginFailure();
                }
            }, {scope: "public_profile, email"});
        });
    };

    var addGoogleLoginHandler = function() {
        $(".jsLoginGoogle").on("click", function() {
            var googleAuth = gapi.auth2.getAuthInstance();
            googleAuth.signIn().then(function() {
                var currentUser = googleAuth.currentUser.get().getBasicProfile();
                Cookies.set("loginStrategy", "google");
                onLoginSuccess({loginStrategy: "google", userName: currentUser.getName(), userEmail: currentUser.getEmail(), userImageUrl: currentUser.getImageUrl()});
            });
        });
    };

    _AppEvent.subscribe("google.init", addGoogleLoginHandler);
    _AppEvent.subscribe("fb.init", addFbLoginHandler);
})(window, AppEvent);
