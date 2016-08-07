(function(_AppEvent) {

    var initFbAuthentication = function() {
        window.fbAsyncInit = function() {
            FB.init({
                appId: "292674011093297",
                xfbml: true,
                version: "v2.7"
            });

            _AppEvent.publish("fb.init");
        };

        (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "//connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
        }(document, "script", "facebook-jssdk"));
    };

    var initGoogleAuthentication = function() {
        /* Load Google's auth2 authentication */
        gapi.load("auth2", function() {
            gapi.auth2.init({
              client_id: "486435004161-du4naaedbge6td38mctin1kh3ju5edca.apps.googleusercontent.com",
              scope: "profile"
            }).then(function() {
                _AppEvent.publish("google.init");
            });
        });
    };

    initGoogleAuthentication();
    initFbAuthentication();
})(AppEvent);
