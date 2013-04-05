var Client = require('./lib/client');

module.exports = function(key) {
    return new Client(key);
};
