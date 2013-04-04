var Client = require('./lib/client');

exports = module.exports = createClient;

var createClient = function(key) {
    return new Client(key);
};

if (require.main === module) {
    var client = new Client('foobar');
    console.log(client.key);
}