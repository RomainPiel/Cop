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
            
        }

        return that;
    }

    return Api;
})