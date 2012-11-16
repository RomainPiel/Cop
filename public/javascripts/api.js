define([
    "jquery"
], function($) {

    var Api = function() {

        var that = {

            getFollowing: function(onComplete) {
                $.ajax({
                    url: "following/",
                    type: 'GET',
                    dataType: 'json',
                    cache: false

                }).done(onComplete);
            },

            getAvatar: function(username) {
                return "avatar/"+username;
            }
            
        }

        return that;
    }

    return Api;
})