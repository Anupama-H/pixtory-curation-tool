$(function() {
    var App = App || {};
    App.apiEndPoint = "http://ec2-52-32-119-223.us-west-2.compute.amazonaws.com/api";

    var validateInputField = function(inputElement) {
        var attr = inputElement.attr("name"),
            value = inputElement.val(),
            isValid = true;

        switch(attr) {
            case "username":
                if(!value) isValid = false;
                break;
            case "email":
                if(!value) isValid = false;
                break;
            case "phone": break;
            case "website": break;
            case "instagram":
                if(!value) isValid = false;
                break;
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

    var submitPixtory = function(event) {
        event.preventDefault();

        var isValid = validateFormData($(".jsStep2 input, .jsStep2 textarea"));

        if(!isValid) {
            Utils.showMessage({
                type: "error",
                message: "Please correct the form data"
            });
            return;
        }

        Utils.clearMessages();
        var formElement = $(".jsContestForm"),
            blobFile = $(".jsPixImage").get(0).files[0],
            formArray = formElement.serializeArray();

        var formData = new FormData();
        formData.append("image", blobFile);

        for(var i=0, len=formArray.length; i<len; i++) {
            formData.append(formArray[i].name, formArray[i].value);
        }

        Utils.makeAjaxCall(App.apiEndPoint + "/contest/createpixtory", "POST", {
            success: function() {
                Utils.showMessage({
                    type: "success",
                    message: "Uploaded Pixtory Successfully !"
                });
            },
            error: function(message) {
                Utils.showMessage({
                    type: "error",
                    message: message
                });
            }
        }, formData);
    };

    var showNextStep = function() {
        var isValid = validateFormData($(".jsStep1 input"));
        if(!isValid) {
            Utils.showMessage({
                type: "error",
                message: "Please correct the form data"
            });
            return;
        }

        Utils.clearMessages();
        $(".jsStep1").hide();
        $(".jsStep2").show();
    };

    /* add event handlers */
    $(".jsNext").on("click", showNextStep);
    $(".jsSubmit").on("click", submitPixtory);
    $(".jsPixImage").on("change", function() {
        var blobFile = $(this).get(0).files[0];
        var reader = new FileReader();
        var imageNameElement = $(".jsImageName");

        reader.onload = function (e) {
            $(".jsUploadedImg").attr("src", e.target.result);
        }

        reader.readAsDataURL(blobFile);

        imageNameElement.text("Uploaded : " + blobFile.name);
        imageNameElement.addClass("uploaded");
    });

})
