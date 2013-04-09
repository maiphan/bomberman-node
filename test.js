var Client = require("./");

if (require.main === module) {
    var client = Client(process.env.BOMBERMAN_API_KEY);
    var badClient = Client("foobar");
    var profaneStr = "Freaking hell";
    var normalStr = "What the heck";
    var jaStr = "聖パトリックの日";

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

    client.censor(profaneStr, function(response) {
        console.log("Profane string censored by default: " + response);
    });

    client.highlight(profaneStr, "<h1>", "</h1>", function(response) {
        console.log("Profane string highlighted: " + response);
    });

    client.highlight(profaneStr, function(response) {
        console.log("Profane string highlighted by default: " + response);
    });

    client.highlight(normalStr, "<h1>", "</h1>", function(response) {
        console.log("Normal string highlighted: " + response);
    });

    client.isProfane(jaStr, "ja", function(response) {
        console.log("Japanese string is profane?: " + response);
    });

    badClient.isProfane(profaneStr, function(response) {
        console.log("Bad client received error: " + response.error);
    });
}