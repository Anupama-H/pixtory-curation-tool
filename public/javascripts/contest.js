$(function() {
    var App = App || {},
        croppieObj;

    App.apiEndPoint = "http://ec2-52-32-119-223.us-west-2.compute.amazonaws.com/api";
//    App.apiEndPoint = "http://pixtory.dev.com/api";

    var autogrowTextarea = function(e) {
        var thisElement = $(this);
        /*  check to see if backspace or delete was pressed, if so, reset the height of the box so it can be resized properly */
        if (e.which == 8 || e.which == 46) {
            thisElement.height(parseFloat(thisElement.css("min-height")) != 0 ? parseFloat(thisElement.css("min-height")) : parseFloat(thisElement.css("font-size")));
        }

        /*  the following will help the text expand as typing takes place */
        while(thisElement.outerHeight() < this.scrollHeight + parseFloat(thisElement.css("borderTopWidth")) + parseFloat(thisElement.css("borderBottomWidth"))) {
            thisElement.height(thisElement.height()+1);
        };
    };

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
            case "category1":
                if(!value || value === "-1") isValid = false;
                break;
            case "story":
                if(!value) isValid = false;
                break;
            case "image":
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
        event.stopPropagation();

        var isValid = validateFormData($(".jsStep2 input, .jsStep2 textarea, .jsContestForm select"));

        if(!isValid) {
            Utils.showMessage({
                type: "error",
                message: "Please correct the form data"
            });
            return;
        }

        Utils.clearMessages();

        croppieObj.croppie("result").then(function(resp) {
            var formElement = $(".jsContestForm"),
                blobFile = Utils.dataURItoBlob(resp),
                formData = new FormData(formElement);

            formData.set("image", blobFile);

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
        });
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

    var setupPixtoryImageCropper = function() {
        var croppieElem = $(".jsCroppie");

        var onImageUploaded = function() {
            var uploadStage1 = $(".jsUpload1"),
                uploadStage2 = $(".jsUpload2");

            var blobFile = this.files[0];
            if(blobFile) {
                var reader = new FileReader();
                reader.onload = function(e) {

                    croppieObj.croppie("bind", {
                        url: e.target.result
                    });

                    if(uploadStage1.is(":visible")) {
                        uploadStage1.hide();
                        uploadStage2.show();
                    }
                }

                reader.readAsDataURL(blobFile);
            } else {
                uploadStage2.hide();
                uploadStage1.show();
            }
        };

        croppieObj = croppieElem.croppie({
            boundary: {
                width: 300,
                height: 526
            },
            viewport: {
                width: 300,
                height: 526,
                type: "square"
            },
            customClass: "custom-croppie",
            showZoomer: false
        });

        $(".jsPixtoryImage").on("change", onImageUploaded);
    };

    var setupFormEventHandlers = function() {
        /* add event handlers */
        $(".jsNext").on("click", showNextStep);
        $(".jsCreatePixtory").on("click", submitPixtory);

        /* Autogrow text area event handler */
        $("textarea").keyup(autogrowTextarea);

        /* Enable/disable select input event handler */
        $("select").on("change", function() {
            var $this = $(this);
            if(this.value !== "-1") {
                $this.addClass("select-enable");
            } else {
                $this.removeClass("select-enable");
            }
        });
    };

    setupFormEventHandlers();
    setupPixtoryImageCropper();
});
