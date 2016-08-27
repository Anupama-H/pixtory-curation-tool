(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var submitBtn = $(".jsCreatePixtory");

        var validatePixtoryData = function(pixtoryData) {
            if(!pixtoryData.file) {
                return false;
            } else if(!pixtoryData.story) {
                return false;
            }
            return true;
        };

        var createPixtory = function(event) {
            event.preventDefault();
            var blobFile = $(".jsPixtoryImage").get(0).files[0],
                story = $(".jsPixtoryStory").val();

            var valid = validatePixtoryData({
                file: blobFile,
                story: story
            });

            if(!valid) {
                Utils.showError("Please upload an image and enter a story");
                return;
            }

            var formData = new FormData();
            formData.append("imageFile", blobFile);
            formData.append("story", story);

            Utils.clearErrors();

            // TODO : Update with correct API
            Utils.makeAjaxCall("upload.php", "POST", {
                success: function(response) {
                   // .. do something
                },
                error: Utils.showError
            }, formData);
        };

        submitBtn.on("click", createPixtory);
    });
})(AppEvent);
