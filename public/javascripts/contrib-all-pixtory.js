(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var pixtoryThumbnailsElem = $(".jsPixtoryThumbnails"),
            pixtoryDetailElem = $(".jsPixtoryDetail");

        var showPixtoryList = function(data) {
            var processedData = data.map(function(obj) {
                delete obj.likes;
                return obj;
            });
            pixtoryThumbnailsElem.render("contrib-pixtory-list", processedData);
        };

        var showPixtoryDetail = function(id) {
            Utils.makeAjaxCall("/stub-api/pixtory-detail?id=" + id, "GET", {
                success: function(data) {
                    /* Hide Pixtory thumbnails view */
                    pixtoryThumbnailsElem.hide();

                    /* Show Pixtory detail view */
                    delete data.likedUsers;
                    delete data.comments;
                    pixtoryDetailElem.render("contrib-pixtory-detail", data).show();

                },
                error: Utils.showError
           });
        };

        var handleBackBtn = function() {
            Utils.clearQueryParam();
            pixtoryThumbnailsElem.show();
            pixtoryDetailElem.hide();
        }

        /* Fetch the list of Pixtories pushed into the app */
        Utils.makeAjaxCall("/stub-api/submitted-pixtories", "GET", {
            success: showPixtoryList,
            error: Utils.showError
        });

        /* Attach click handlers on the Pixtory thumbnail elements */
        pixtoryThumbnailsElem.on("click", ".jsPixtoryCard", function(event) {
            var id = $(event.target).data("id");
            Utils.addQueryParam({detail: id});
            showPixtoryDetail(id);
        });

        /* Attach back event handler */
        pixtoryDetailElem.on("click", ".jsBackBtn", handleBackBtn);

        /* if "detail" query parameter is present in URL, show Pixtory Detail Page */
        var idParam = Utils.getQueryParameter("detail");
        if(idParam) {
            showPixtoryDetail(idParam);
        }
    });
})(AppEvent);
