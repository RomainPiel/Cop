'use strict';

var qs = require('querystring')
var request = require('request');
var utils = require('./utils');

var APPNET_URL = 'https://alpha-api.app.net/stream/0';

// chains request
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