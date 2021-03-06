requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.8.2.min'
    }
});


// Load the application.
require(
[
    "jquery", 
    "api", 
], 
function($, Api) {

    var api = Api();

    var userListEl, spinnerEl;

    $(function() {

        userListEl = $("#user-list");
        loaderEl = $("#loader");

        startLoading();

        userListEl.find("li button.follow").live("click", function() {
            var $this = $(this),
                li = $this.closest("li"),
                action = li.attr("data-action");

            if ($this.hasClass("disabled")) return;
            $this.addClass("disabled");

            var apiCall;
            if (action == "follow") {
                apiCall = api.follow;
            } else if (action == "unfollow") {
                apiCall = api.unfollow;
            }

            if (!apiCall) return;

            apiCall(li.attr("data-id"), function(res) {
                if (!res || !res.data) return;

                if (res.data.you_follow) {
                    $this.text("Unfollow");
                    li.attr("data-action", "unfollow");
                } else {
                    $this.text("Follow");
                    li.attr("data-action", "follow");
                }

                $this.removeClass("disabled");
            });
        });

        api.getFollowing(function(data) {
            
            if (data) {

                var maxPostCount = getMaxPostCount(data),
                    biggestInactiveGap = getBiggestInactiveGap(data);

                for (var i in data) {
                    calculateScore(data[i], maxPostCount, biggestInactiveGap);
                }

                data.sort(compareUsers);

                var liEl;
                for (var i in data) {
                    liEl =
                        $("<li></li>")
                            .attr("data-id", "@"+data[i].username)
                            .attr("data-action", "unfollow")
                            .append($("<div></div>")
                                .addClass("bar")
                                .attr("data-width", (data[i].score*100)+"%")
                            )
                            .append($("<img></img>").attr("src", api.getAvatar("@"+data[i].username)))
                            .append($("<span></span>").text("@"+data[i].username+" - "))
                            .append($("<span></span>").addClass("small").text(data[i].name.toUpperCase()))
                            .append($("<button></button>").addClass("btn pull-right follow").text("Unfollow"))
                    
                    userListEl.append(liEl);

                    setTimeout(function() {
                        $("div.bar[data-width]").each(function() {
                            var $this = $(this);
                            $this.css({width: $this.attr("data-width")});
                        })
                    }, 0)
                }
            }

            stopLoading();

        });
    });

    function compareUsers(u1, u2) {
        return -u1.score + u2.score;
    }

    function getMaxPostCount(users) {
        var result = null;
        for (var i in users) {
            if (result == null || result < users[i].post_count) {
                result = users[i].post_count;
            }
        }
        return result;
    }

    function getBiggestInactiveGap(users) {
        var result = null;
        var aux;
        for (var i in users) {
            aux = new Date() - new Date(users[i].last_post_at);
            if (result == null || (users[i].last_post_at != null && result > aux)) {
                result = aux;
            }
        }

        return result;
    }

    function calculateScore(user, maxPostCount, biggestInactiveGap) {
        var postScore = user.post_count/maxPostCount;
        
        var activityScore = 0;
        if (user.last_post_at != null) {
            activityScore = biggestInactiveGap/(new Date() - new Date(user.last_post_at));
        }

        user.score = (postScore*3 + activityScore)/4;
    }

    function startLoading() {
        userListEl.hide();
        loaderEl.show();
    }

    function stopLoading() {
        userListEl.show();
        loaderEl.hide();
    }

});