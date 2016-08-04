$(function() {

    var showPixtoryList = function(data) {
        $(".jsPixtoryThumbnails").render("contrib-pixtory-list", data);
    };

    Utils.makeAjaxCall("/stub-api/pushed-pixtories", showPixtoryList, Utils.showError);
});
