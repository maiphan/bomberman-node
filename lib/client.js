var https = require('https');
var querystring = require('querystring');
var _ = require('underscore');

// Defaults for the client.
var DEFAULTS = {
    apiVersion: 1,
    hostName: "bomberman.ikayzo.com"
    
    // Uncomment the following line if you are using the Bomberman Heroku addon.
    // hostName: "bomberman-prod.herokuapp.com"
};

var Client = module.exports = function(key, options) {
    this.key = key;
    if (!_.isUndefined(options)) {
        _.defaults(this, options);
    }
    _.defaults(this, DEFAULTS);
    return this;
};

// Private function for creating connections.
var createConnection = function(options, callback) {

    var req = https.request(options, function(res) {
        var body = "";
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            if (res.statusCode >= 400) {
                result = {
                    'errorStatus': res.statusCode,
                    'error': body
                };

                if (res.statusCode === 400) {
                    result['error'] = 'Bad request';
                }
                else if (res.statusCode === 401) {
                    result['error'] = 'Unauthorized';
                }
                else if (res.statusCode === 403) {
                    result['error'] = 'Rate limit exceeded';
                }
                else if (res.statusCode === 500) {
                    result['error'] = 'Internal server error';
                }

                callback(result);
            }
            else {
                callback(body);
            }
        });
    });

    req.on('error', function(e) {
        callback({"error": e});
    });

    req.end();
};

// Internal function for creating the API path.
Client.prototype._makePath = function(apiPath, language) {
    var path = "/v" + this.apiVersion;
    path += apiPath.charAt(0) === "/" ? apiPath : "/" + apiPath;
    var langUndefined = _.isUndefined(language) || _.isNull(language);

    if (language === "ja") {
        return "/api/ja" + path;
    }
    else if (langUndefined || language  === "en") {
        return '/api' + path;
    }

    throw new Error("Unsupported language " + language);
};

// Internal function for creating the options for the connection.
Client.prototype._makeConnectionOptions = function(path, params) {
    return {
        path: path + "?" + querystring.stringify(params),
        hostname: this.hostName,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Token token=' + this.key
        }
    };
};

Client.prototype.isProfane = function(corpus, langOrCallback, callback) {
    var path = "";
    if (_.isFunction(langOrCallback)) {
        path = this._makePath("/profanity/check");
        callback = langOrCallback;
    }
    else {
        path = this._makePath("/profanity/check", langOrCallback);
    }

    var params = {"corpus": corpus};
    var options = this._makeConnectionOptions(path, params);

    createConnection(options, function(response) {
        if (!_.isUndefined(response.error)) {
            callback(response);
        }
        else {
            callback(response === "1");
        }
    });
};

Client.prototype.censor = function(corpus, replacementOrCallback, langOrCallback, callback) {
    // Use partial application to build the make path function.
    var pathFunc = _.bind(this._makePath, this, "/profanity/censor");
    var params = {"corpus": corpus};

    // Check how many arguments we have by seeing where the callback is.
    if (_.isFunction(replacementOrCallback)) {
        callback = replacementOrCallback;
    }
    else if (_.isFunction(langOrCallback)) {
        params.replacement_text = replacementOrCallback;
        callback = langOrCallback;
    }
    else {
        params.replacement_text = replacementOrCallback;
        // Partially apply the language.
        pathFunc = _.bind(pathFunc, this, langOrCallback);
    }

    var options = this._makeConnectionOptions(pathFunc(), params);

    createConnection(options, function(response) {
        if (!_.isUndefined(response.error)) {
            callback(response);
        }
        else {
            callback(JSON.parse(response).censored_text);
        }
    });
};

Client.prototype.highlight = function(corpus, tagOrCallback, endTag, langOrCallback, callback) {
    // Use partial application to build the path and apply the language if provided.
    var pathFunc = _.bind(this._makePath, this, "/profanity/highlight");
    var params = {"corpus": corpus};

    if (_.isFunction(tagOrCallback)) {
        callback = tagOrCallback;
    }
    else if (_.isFunction(langOrCallback)) {
        params.start_tag = tagOrCallback;
        params.end_tag = endTag;
        callback = langOrCallback;
    }
    else {
        params.start_tag = tagOrCallback;
        params.end_tag = endTag;
        pathFunc = _.bind(pathFunc, this, langOrCallback);
    }

    var options = this._makeConnectionOptions(pathFunc(), params);

    createConnection(options, function(response) {
        if (!_.isUndefined(response.error)) {
            callback(response);
        }
        else {
            callback(JSON.parse(response).highlighted_text);
        }
    });
};
