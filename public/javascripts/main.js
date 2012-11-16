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

    var userListEl;

    $(function() {

        userListEl = $("#user-list");

        api.getFollowing(function(data) {
            
            if (data) {
                for (var i in data) {
                    userListEl.append(
                        $("<li></li>")
                            .append($("<span></span>").text("@"+data[i].username))
                            .append($("<span></span>").text("("+data[i].name+")"))
                    );
                }
            }

        });
    });

});