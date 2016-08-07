(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var pixtoryThumbnailsElem = $(".jsPixtoryThumbnails"),
            pixtoryDetailElem = $(".jsPixtoryDetail");

        var showPixtoryList = function(data) {
            pixtoryThumbnailsElem.render("contrib-pixtory-list", data);
        };

        var showPixtoryDetail = function(event) {
            var id = $(event.target).data("id");
            Utils.makeAjaxCall("/stub-api/pixtory-detail?id=" + id, function(data) {
                /* Hide Pixtory thumbnails view */
                pixtoryThumbnailsElem.hide();

                /* Show Pixtory detail view */
                pixtoryDetailElem.render("contrib-pixtory-detail", data).show();

            }, Utils.showError);
        };

        var handleBackBtn = function() {
            pixtoryThumbnailsElem.show();
            pixtoryDetailElem.hide();
        }

        /* Fetch the list of Pixtories puhed into the app */
        Utils.makeAjaxCall("/stub-api/pushed-pixtories", showPixtoryList, Utils.showError);

        /* Attach click handlers on the Pixtory thumbnail elements */
        pixtoryThumbnailsElem.on("click", ".jsPixtoryCard", showPixtoryDetail);

        /* Attach back event handler */
        pixtoryDetailElem.on("click", ".jsBackBtn", handleBackBtn);
    });
})(AppEvent);
