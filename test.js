var Client = require("./");

if (require.main === module) {
    var client = Client(process.env.BOMBERMAN_API_KEY);
    var badClient = Client("foobar");
    var profaneStr = "Fucking hell";
    var normalStr = "What the heck";
    client.isProfane(profaneStr, function(response) {
        console.log("Profane string is profane? " + response);
    });

    client.isProfane(normalStr, function(response) {
        console.log("Normal string is profane? " + response);
    });

    client.censor(profaneStr, "REDACTED", function(response) {
        console.log("Profane string censored: " + response);
    });

    client.censor(normalStr, "REDACTED", function(response) {
        console.log("Normal string censored: " + response);
    });

    client.highlight(profaneStr, "h1", "h1", function(response) {
        console.log("Profane string highlighted: " + response);
    });

    client.highlight(normalStr, "start", "end", function(response) {
        console.log("Normal string highlighted: " + response);
    });

    badClient.isProfane(profaneStr, function(response) {
        console.log("Received error: " + response.error);
    });
}