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

    $(function() {

    });

});