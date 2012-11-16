module.exports = function(app, isLoggedIn) {

    var appdotnet = require('../lib/appdotnet');

    app.get('/', function(req, res) {
        res.render('index', {
            title: "Cop"
        });
    });

    app.get('/app', function(req, res) {
        if(req.session.passport.user) {
            res.render('app', {
                title: "Cop",
            });
        } else {
            res.redirect("/auth/appdotnet");
        }
    });

    app.get('/following', isLoggedIn, function(req, res) {
        appdotnet.getFollowingIds(req, function(err, user) {
            if(err) {
                res.status(500);
                res.json({
                    'error': 'error retrieving following'
                });
            } else {
                res.json(user);
            }
        });
    });
}