var Client = module.exports = function(key) {
    this.key = key;
    this.defaultConfiguration();
    return this;
};

Client.prototype.defaultConfiguration = function() {
    this.apiVersion = 1;
    this.useHttps = true;
    this.url = "bomberman-prod.herokuapp.com";
};

Client.prototype.getConnectionUrl = function() {
    var protocol = "http";
    if (useHttps) {
        protocol = "https";
    }

    return protocol + "://" + this.url;
};
