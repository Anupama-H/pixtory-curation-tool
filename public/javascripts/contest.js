$(function() {

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
                var blobFile = $(".jsPixImage").get(0).files[0];
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
            Utils.showError("Please correct the form data");
            return;
        }

        Utils.clearErrors();
        var formElement = $(".jsContestForm"),
            blobFile = $(".jsPixImage").get(0).files[0],
            formArray = formElement.serializeArray();

        var formData = new FormData();
        formData.append("imageFile", blobFile);

        for(var i=0, len=formArray.length; i<len; i++) {
            formData.append(formArray[i].name, formArray[i].value);
        }

        Utils.makeAjaxCall("contest-upload.php", "POST", {
            success: function() {
                console.log("Success");
            },
            error: function(message) {
                Utils.showError(message);
            }
        }, formData);
    };

    var showNextStep = function() {
        var isValid = validateFormData($(".jsStep1 input"));
        if(!isValid) {
            Utils.showError("Please correct the form data");
            return;
        }

        Utils.clearErrors();
        $(".jsStep1").hide();
        $(".jsStep2").show();
    };

    /* add event handlers */
    $(".jsNext").on("click", showNextStep);
    $(".jsSubmit").on("click", submitPixtory);
    $(".jsPixImage").on("change", function() {
        var blobFile = $(this).get(0).files[0];
        $(".jsImageName").text("Uploaded : " + blobFile.name);
    });

})
