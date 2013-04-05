var http = require('http');
var https = require('https');
var querystring = require('querystring');
var _ = require('underscore');

// Defaults for the client.
var DEFAULTS = {
    apiVersion: 1,
    useHttps: true,
    hostName: "bomberman-prod.herokuapp.com"
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
var createConnection = function(isSecure, options, callback) {
    var httpLib = isSecure ? https : http;

    var req = httpLib.request(options, function(res) {
        var body = "";
        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            callback(body);
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

    if (typeof language !== "undefined" && language === "jp") {
        return "/jp" + path;
    }
    else if (typeof language === "undefined" || language  === "en") {
        return path;
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

    createConnection(this.useHttps, options, function(response) {
        if (!_.isUndefined(response.error)) {
            callback({"error": response.error});
        }
        else {
            callback(response === "1");
        }
    });
};

Client.prototype.censor = function(corpus, replacementText, langOrCallback, callback) {
    var path = "";
    if (_.isFunction(langOrCallback)) {
        path = this._makePath("/profanity/censor");
        callback = langOrCallback;
    }
    else {
        path = this._makePath("/profanity/censor", langOrCallback);
    }

    var params = {"corpus": corpus, "replacement_text": replacementText};
    var options = this._makeConnectionOptions(path, params);

    createConnection(this.useHttps, options, function(response) {
        if (!_.isUndefined(response.error)) {
            callback({"error": response.error});
        }
        else {
            callback(JSON.parse(response).censored_text);
        }
    });
};

Client.prototype.highlight = function(corpus, startTag, endTag, langOrCallback, callback) {
    var path = "";
    if (_.isFunction(langOrCallback)) {
        path = this._makePath("/profanity/highlight");
        callback = langOrCallback;
    }
    else {
        path = this._makePath("/profanity/highlight", langOrCallback);
    }

    var params = {
        "corpus": corpus,
        "startTag": startTag,
        "endTag": endTag
    };
    var options = this._makeConnectionOptions(path, params);

    createConnection(this.useHttps, options, function(response) {
        if (!_.isUndefined(response.error)) {
            callback({"error": response.error});
        }
        else {
            callback(JSON.parse(response).highlighted_text);
        }
    });
};
