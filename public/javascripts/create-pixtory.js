(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var validateInputField = function(inputElement) {
            var attr = inputElement.attr("name"),
                value = inputElement.val(),
                isValid = true;

            switch(attr) {
                case "title":
                    if(!value) isValid = false;
                    break;
                case "location": break;
                case "category":
                    if(!value) isValid = false;
                    break;
                case "story":
                    if(!value) isValid = false;
                    break;
                case "imageFile":
                    var blobFile = inputElement.get(0).files[0];
                    if(!blobFile) isValid = false;
                    break;
            }

            return isValid;
        };

        var validateFormData = function(inputArray) {
            var isValid = true,
                jqInput;

            inputArray.removeClass("form-error");

            for(var i=0, len=inputArray.length; i<len; i++) {
                jqInput = $(inputArray[i]);
                if(!validateInputField(jqInput)) {
                    isValid = false;
                    jqInput.addClass("form-error");
                }
            }

            return isValid;
        };

        var createPixtory = function(event) {
            event.preventDefault();
            var isValid = validateFormData($(".jsCreateForm input, .jsCreateForm textarea"));

            if(!isValid) {
                Utils.showMessage({
                    type: "error",
                    message: "Please fill all the required fields"
                });
                return;
            }

            Utils.clearMessages();
            var formElement = $(".jsCreateForm"),
                blobFile = $(".jsPixtoryImage").get(0).files[0],
                formArray = formElement.serializeArray();

            var formData = new FormData();
            formData.append("image", blobFile);

            for(var i=0, len=formArray.length; i<len; i++) {
                formData.append(formArray[i].name, formArray[i].value);
            }

            Utils.makeAjaxCall(App.apiEndPoint + "/contributor/createpixtory", "POST", {
                success: function(response) {
                    Utils.showMessage({
                        type: "success",
                        message: "Uploaded Pixtory Successfully!"
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

        /* add event handlers */
        $(".jsCreatePixtory").on("click", createPixtory);
        $(".jsPixtoryImage").on("change", function() {
            var blobFile = $(this).get(0).files[0];
            $(".jsImageName").text("Uploaded : " + blobFile.name);
        });
    });
})(AppEvent);
