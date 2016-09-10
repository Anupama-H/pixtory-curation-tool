(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var statusMap = {
                1: "SUBMITTED",
                2: "PROCESSING", //processing
                3: "REJECTED", //rejected
                4: "PUSHED" // pushed
            };

        var thumbnailsContainer = $(".jqThumbnailsCont"),
            pixtoryThumbnailsElem = $(".jsPixtoryThumbnails"),
            pixtoryDetailElem = $(".jsPixtoryDetail");

        var allPixtories = [];

        var showPixtoryList = function(data) {
            var processedData = data.map(function(obj) {
                delete obj.likes;
                obj.status = statusMap[obj.status];
                return obj;
            });
            pixtoryThumbnailsElem.render("contrib-pixtory-list", processedData);
        };

        var showPixtoryDetail = function(id) {
            Utils.makeAjaxCall(App.apiEndPoint + "/contributor/pixtoryDetail?id=" + id, "GET", {
                success: function(data) {
                    /* Hide Pixtory thumbnails view */
                    thumbnailsContainer.hide();

                    /* Show Pixtory detail view */
                    delete data.likedUsers;
                    delete data.comments;
                    data.status = statusMap[data.status];
                    pixtoryDetailElem.render("contrib-pixtory-detail", data).show();

                },
                error: function(errorMessage) {
                    Utils.showMessage({
                        type: "error",
                        message: errorMessage
                    });
                }
           });
        };

        var handleBackBtn = function() {
            Utils.clearQueryParam();
            thumbnailsContainer.show();
            pixtoryDetailElem.hide();
        }

        var showFilteredData = function(event) {
            var selected = $(this).val(),
                filteredData;

            if(selected !== "ALL") {
                filteredData = allPixtories.filter(function(obj) {
                    return obj.status === selected;
                });
            } else {
                filteredData = allPixtories;
            }
            showPixtoryList(filteredData);
        }

        /* Fetch the list of All Submitted Pixtories */
        Utils.makeAjaxCall(App.apiEndPoint + "/contributor/pixtoriesSubmitted", "GET", {
            success: function(data) {
                allPixtories = data;
                showPixtoryList(allPixtories);
            },
            error: function(errorMessage) {
                Utils.showMessage({
                    type: "error",
                    message: errorMessage
                });
            }
        });

        /* Attach click handlers on the Pixtory thumbnail elements */
        pixtoryThumbnailsElem.on("click", ".jsPixtoryCard", function(event) {
            var id = $(event.target).data("id");
            Utils.addQueryParam({detail: id});
            showPixtoryDetail(id);
        });

        /* Attach back event handler */
        pixtoryDetailElem.on("click", ".jsBackBtn", handleBackBtn);

        /* Add filter select change handler */
        $(".jqFilter").on("change", showFilteredData);

        /* if "detail" query parameter is present in URL, show Pixtory Detail Page */
        var idParam = Utils.getQueryParameter("detail");
        if(idParam) {
            showPixtoryDetail(idParam);
        }
    });
})(AppEvent);
