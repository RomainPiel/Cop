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

exports.getFollowing = function(req, callback) {
    var user = utils.getUser(req);
    var url = '/users/me/following';

    var params = {
        access_token: user.access_token,
        count: 10000000
    };

    requestGet(url, params, callback);
};

exports.getLastPosts = function(req, callback) {
    var user = utils.getUser(req);
    var users = req.query.users;

    var params = {
        access_token: user.access_token,
        count: 1
    };

    var tempUrl, urls = [], urlsObjs = {};
    for (var i in users) {
        tempUrl = APPNET_URL + '/users/@' + users[i].username + '/posts?' + qs.stringify(params);
        urls.push(tempUrl);
        urlsObjs[tempUrl] = users[i];
    }

    __request(urls, function(responses) {

        var tempBody, tempData, tempFirstPost, result = [];
        console.log(Object.keys(responses).length);
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
                    } else if (tempFirstPost.user) {
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