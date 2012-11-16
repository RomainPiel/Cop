'use strict';

exports.getUser = function(req) {
    if(req.session.passport.user._json && req.session.passport.user._json.data) {
        return req.session.passport.user._json.data;
    } else {
        return req.session.passport.user;
    }
};

exports.getUserById = function(req) {
    if(req.session.passport.user._json && req.session.passport.user._json.data) {
        return req.session.passport.user._json.data.id;
    } else {
        return req.session.passport.user.id;
    }
};