(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var croppieObj;

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
                case "title":
                    if(!value) isValid = false;
                    break;
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

        var createPixtory = function(event) {
            event.preventDefault();
            event.stopPropagation();

            var isValid = validateFormData($(".jsCreateForm input, .jsCreateForm textarea, .jsCreateForm select"));

            if(!isValid) {
                Utils.showMessage({
                    type: "error",
                    message: "Please fill all the required fields"
                });
                return;
            }

            Utils.clearMessages();

            croppieObj.croppie("result").then(function(resp) {
                var formElement = $(".jsCreateForm").get(0),
                    blobFile = Utils.dataURItoBlob(resp),
                    formData = new FormData(formElement);

                formData.set("image", blobFile);

                Utils.makeAjaxCall(App.apiEndPoint + "/contributor/createpixtory", "POST", {
                    success: function(response) {
                        Utils.showMessage({
                            type: "success",
                            message: "Uploaded Pixtory Successfully!"
                        });

                        /* clear form fields */
                        formElement.reset();

                        /* trigger a change event on image & select inputs */
                        $(".jsPixtoryImage, select").trigger("change");
                    },
                    error: function(errorMessage) {
                        Utils.showMessage({
                            type: "error",
                            message: errorMessage
                        });
                    }
                }, formData);
			});

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
            /* Create Pixtory event handler */
            $(".jsCreatePixtory").on("click", createPixtory);

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

        var setupResourcesEventHandlers = function() {

            var handleDDClick = function(event) {
                var action = $(event.target).attr("data-action");

                switch(action) {
                    case "how-pixtory":
                        Utils.showModal({
                            template: "contrib-how-pixtory"
                        });
                        break;
                    case "sample-pixtory":
                        var data = [{
                            front: "/portal/images/sample-pixtories/1-front.jpg",
                            back: "/portal/images/sample-pixtories/1-back.jpg",
                        }, {
                            front: "/portal/images/sample-pixtories/2-front.jpg",
                            back: "/portal/images/sample-pixtories/2-back.jpg",
                        }, {
                            front: "/portal/images/sample-pixtories/3-front.jpg",
                            back: "/portal/images/sample-pixtories/3-back.jpg",
                        }];

                        Utils.showModal({
                            template: "contrib-sample-pixtory",
                            data: data
                        });
                        break;
                }
            };

            $(".jsResourcesDD").on("click", handleDDClick);
            $("body").on("click", function(event) {
                if(!$(event.target).hasClass("jsClkBlk")) {
                    var checkBoxElement = $(".jsResourcesChk");
                    if(checkBoxElement.is(":checked")) {
                        checkBoxElement.prop("checked", false);
                    }
                }
            });
        };

        setupResourcesEventHandlers();
        setupFormEventHandlers();
        setupPixtoryImageCropper();
    });
})(AppEvent);
