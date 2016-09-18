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
            Utils.makeAjaxCall(App.apiEndPoint + "/contributor/pixtoryDetail?id=" + id, "GET", {
                success: function(data) {
                    /* Hide Pixtory thumbnails view */
                    pixtoryThumbnailsElem.hide();

                    /* Show Pixtory detail view */
                    delete data.status;
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
            var idParam = Utils.getQueryParameter("detail");
            Utils.clearQueryParam();
            pixtoryThumbnailsElem.show();
            pixtoryDetailElem.hide();
            if(idParam) {
                Utils.scrollToElement($("[data-id='" + idParam + "']"));
            }
        }

        var showCommentsSection = function() {
            var commentsElement = $(".jsCommentsCont");

            commentsElement.show();

            /* scroll to comments container */
            Utils.scrollToElement(commentsElement);
        };

        var addComment = function() {
            var idParam = Utils.getQueryParameter("detail");
            var commentObj = {
                comment : $(".jsCommentInput").val(),
                contentId: idParam
            };

            if(!commentObj.comment) {
                Utils.showMessage({
                    type: "error",
                    message: "Please enter a comment"
                });
                return;
            }

            Utils.clearMessages();

            Utils.makeAjaxCall(App.apiEndPoint + "/contributor/comment", "POST", {
                success: function(response) {
                    var user = Utils.getUser();
                    if(user) {
                        var commentsTemplate = "<div class='comment-blk'><img src='" + user.imageUrl + "'/><div class='comment-right'><div>" + commentObj.comment + "</div><div class='comment-name'>" + user.userName + "</div></div></div>";

                        $(".jsCommentsBlk").append(commentsTemplate);
                    }

                    /* clear input field */
                    $(".jsCommentInput").val("");
                },
                error: function(errorMessage) {
                    Utils.showMessage({
                        type: "error",
                        message: errorMessage
                    });
                }
            }, JSON.stringify(commentObj));
        };

        /* Fetch the list of Pixtories pushed into the app */
        Utils.makeAjaxCall(App.apiEndPoint + "/contributor/pixtoriesInApp", "GET", {
            success: showPixtoryList,
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
