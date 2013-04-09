var Client = require('./lib/client');

module.exports = function(key, options) {
    return new Client(key, options);
};
