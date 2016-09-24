(function(_AppEvent, _App) {
    _AppEvent.subscribe("load.page", function() {
        var profileContainer = $(".jsProfile");

        profileContainer.render("contrib-profile", Utils.getUser());

        var updateUserProfile = function(event) {
            event.preventDefault();
            event.stopPropagation();

            var formElement = $(".jsProfileForm").get(0),
                formData = new FormData(formElement);

            Utils.makeAjaxCall(_App.apiEndPoint + "/contributor/updateUserProfile", "POST", {
                success: function() {
                    Utils.showMessage({
                        type: "success",
                        message: "Updated Profile Successfully!"
                    });
                },
                error: function(errorMessage) {
                    Utils.showMessage({
                        type: "error",
                        message: errorMessage
                    });
                }
            }, formData);
        };

        var setUpEventHandlers = function() {
            profileContainer.on("change", "input[type='file']", function() {
                var blobFile = this.files[0];
                if(blobFile) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $(".jsUserImage").attr("src", e.target.result);
                    }
                    reader.readAsDataURL(blobFile);
                }
            });

            profileContainer.on("click", ".jsUpdateUser", updateUserProfile);
        };

        setUpEventHandlers();
    });
})(AppEvent, App);
