'use strict';

var qs = require('querystring')
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';
var TIMEOUT = 8000;

var __request = function(urls, callback) {

        'use strict';

        var results = {},
            t = urls.length,
            c = 0,
            handler = function(error, response, body) {

                var url = response.request.uri.href;

                results[url] = {
                    error: error,
                    response: response,
                    body: body
                };

                if(++c === urls.length) {
                    callback(results);
                }

            };

        while(t--) {
            request(urls[t], handler);
        }
    };

var requestGet = function(url, params, callback) {
        request.get({
            uri: APPNET_URL + url + '?' + qs.stringify(params),
            timeout: TIMEOUT
        }, function(err, resp, body) {

            if(err) {
                callback(err);
            } else {
                try {
                    callback(null, JSON.parse(body));
                } catch(err) {
                    console.log(err);
                    callback(err);
                }
            }
        });
    };

var requestPost = function(params, callback) {
        request.post(params, function(err, resp, body) {
            if(err) {
                callback(err);
            } else {
                try {
                    callback(null, JSON.parse(body));
                } catch(err) {
                    callback(err);
                }
            }
        });
    };

var requestDelete = function(uri, callback) {
        request.del({
            uri: APPNET_URL + uri,
            timeout: TIMEOUT
        }, function(err, resp, body) {

            if(err) {
                callback(err);
            } else {
                try {
                    callback(null, JSON.parse(body));
                } catch(err) {
                    callback(err);
                }
            }
        });
    };

exports.getFollowing = function(req, callback) {
    var user = utils.getUser(req);
    var url = '/users/me/following';

    var params = {
        access_token: user.access_token,
        count: 10000000
    };

    requestGet(url, params, callback);
};

exports.follow = function(req, callback) {
    var user = utils.getUser(req);
    var userId = req.query.username;

    var qs = {
        access_token: user.access_token
    };

    var params = {
        url: APPNET_URL + '/users/' + userId + '/follow',
        form: qs,
        timeout: TIMEOUT
    };

    requestPost(params, callback);
};

exports.unfollow = function(req, callback) {
    var user = utils.getUser(req);
    var userId = req.query.username;

    var params = {
        access_token: user.access_token
    };

    var uri = '/users/' + userId + '/follow?' + qs.stringify(params);

    requestDelete(uri, callback);
};

exports.getLastPosts = function(req, callback) {
    var user = utils.getUser(req);
    var users = req.query.users;

    var params = {
        access_token: user.access_token,
        count: 1
    };

    var tempUrl, urls = [],
        urlsObjs = {};
    for(var i in users) {
        tempUrl = APPNET_URL + '/users/@' + users[i].username + '/posts?' + qs.stringify(params);
        urls.push(tempUrl);
        urlsObjs[tempUrl] = users[i];
    }

    __request(urls, function(responses) {

        var tempBody, tempData, tempFirstPost, result = [];
        for(var url in responses) {
            if(responses[url].error) {
                callback(responses[url].error);
                return;
            } else {
                try {
                    tempBody = responses[url].response.body;
                    tempData = JSON.parse(tempBody).data;
                    tempFirstPost = tempData[0];

                    if(tempFirstPost == null) {
                        result.push({
                            "post_count": 0,
                            "username": urlsObjs[url].username,
                            "name": urlsObjs[url].name
                        });
                    } else if(tempFirstPost.user) {
                        result.push({
                            "post_count": tempFirstPost.user.counts.posts,
                            "last_post_at": tempFirstPost.created_at,
                            "username": urlsObjs[url].username,
                            "name": urlsObjs[url].name
                        });
                    }

                } catch(err) {
                    callback(err);
                }
            }
        }

        callback(null, result);
    });
};

exports.getAvatarUrl = function(req) {
    var url = APPNET_URL + '/users/' + req.params.userid + "/avatar";
    return url;
};