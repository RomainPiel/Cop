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
        appdotnet.getFollowing(req, function(err, res1) {
            if(err) {
                res.status(500);
                res.json({
                    'error': 'error retrieving following'
                });
            } else {
                req.query.users = res1.data;

                appdotnet.getLastPosts(req, function(err, res2) {
                    if(err) {
                        res.status(500);
                        res.json({
                            'error': 'error retrieving last posts'
                        });
                    } else {
                        res.json(res2);
                    }
                })
            }
        });
    });

    app.get('/follow', isLoggedIn, function(req, res) {
        appdotnet.follow(req, function(err, res1) {
            if(err) {
                res.status(500);
                res.json({
                    'error': 'error retrieving following'
                });
            } else {
                res.json(res1);
            }
        });
    });

    app.get('/unfollow', isLoggedIn, function(req, res) {
        appdotnet.unfollow(req, function(err, res1) {
            if(err) {
                res.status(500);
                res.json({
                    'error': 'error retrieving following'
                });
            } else {
                res.json(res1);
            }
        });
    });

    app.get('/avatar/:userid', function(req, res) {
        res.redirect(appdotnet.getAvatarUrl(req));
    });
}