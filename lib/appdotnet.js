'use strict';

var qs = require('querystring')
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';
var TIMEOUT = 8000;

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
                    callback(err);
                }
            }
        });
    };

exports.getFollowingIds = function(req, callback) {
    var user = utils.getUser(req);
    var url = '/users/me/following/ids';

    var params = {
        access_token: user.access_token
    };

    requestGet(url, params, callback);
};