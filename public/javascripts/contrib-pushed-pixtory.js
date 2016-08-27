(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var pixtoryThumbnailsElem = $(".jsPixtoryThumbnails"),
            pixtoryDetailElem = $(".jsPixtoryDetail");

        var clearQueryParam = function() {
            if (history.pushState) {
                var newurl = window.location.origin + window.location.pathname;
                window.history.pushState({path:newurl},"",newurl);
            }
        };

        var addQueryParam = function(obj) {
            if (history.pushState) {
                var newurl = window.location.origin + window.location.pathname + "?" + $.param(obj);
                window.history.pushState({path:newurl}, "", newurl);
            }
        };

        var showPixtoryList = function(data) {
            var processedData = data.map(function(obj) {
                delete obj.status;
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
                    delete data.status;
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

        var showCommentsSection = function() {
            var commentsElement = $(".jsCommentsCont");

            commentsElement.show();

            /* scroll to comments container */
            var offset = commentsElement.offset();
            $("body").animate({
                scrollTop: offset.top,
                scrollLeft: offset.left
            });
        };

        var addComment = function() {
            var comment = $(".jsCommentInput").val();

            if(!comment) {
                Utils.showError("Please enter a comment");
                return;
            }

            var formData = new FormData();
            formData.append("comment", comment);

            Utils.clearErrors();

            // TODO : Update with correct API
            Utils.makeAjaxCall("/contributor/comment", "POST", {
                success: function(response) {
                    var user = Utils.getUser();
                    if(user) {
                        var commentsTemplate = "<div class='comment-blk'><img src='" + user.profileImage + "'/><div class='comment-right'><div>" + comment + "</div><div class='comment-name'>" + user.username + "</div></div></div>";

                        $(".jsCommentsBlk").append(commentsTemplate);
                    }
                },
                error: Utils.showError
            }, formData);
        };

        /* Fetch the list of Pixtories pushed into the app */
        Utils.makeAjaxCall("/stub-api/pushed-pixtories", "GET", {
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

        /* Attach comments event handler */
        pixtoryDetailElem.on("click", ".jsComments", showCommentsSection);

        /* Attach Add Comment event handler */
        pixtoryDetailElem.on("click", ".jsAddComment", addComment);

        /* if "detail" query parameter is present in URL, show Pixtory Detail Page */
        var idParam = Utils.getQueryParameter("detail");
        if(idParam) {
            showPixtoryDetail(idParam);
        }
    });
})(AppEvent);
