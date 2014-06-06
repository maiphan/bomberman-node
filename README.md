# Bomberman

[![Build Status](https://travis-ci.org/ikayzo/bomberman-node.png)](https://travis-ci.org/ikayzo/bomberman-node)

This is a Node.js package for the Bomberman HTTP API.

[Bomberman](http://addons.heroku.com/bomberman): shelter from profanity bombing, is an [add-on](http://addons.heroku.com) for Heroku
applications. If you would like to be part of the alpha or early beta
testing process please email <bomberman-support@ikayzo.com>.

For detailed instructions on installing the addon to your Heroku
application please see our [add-on documentation page](http://bomberman.ikayzo.com/)

## Installing via NPM

Install bomberman-node via npm.

```term
$ npm install bomberman
```

Once installed, create an instance of the client in your Node.js code.

```js
var Client = require('bomberman');

var client = Client("your api key");
```

### Checking if Text Contains Profanity

To check if a piece of text or *corpus* contains profanity use the
`.isProfane(corpus, [language,] callback)` method. The callback
should take a parameter that is true if the string is profane and
false otherwise.

```js
client.isProfane("What the heck?", function(response) {
    // response is false.
});

client.isProfane("What the hell?", function(response) {
    //response is true
})

```

### Censoring Profane Words & Phrases

If you would like to save or display text where the profane words (if
any) are obfuscated, use `.censor(corpus, [replacement_text, [language,]] callback)`.

```js
client.censor("What the hell", "CENSORED", function(response) {
    // response is "What the CENSORED"
});
```

The `replacement_text` parameter is a string and optional. `"***"` is
used by default.

```js
client.censor("What the hell", function(response) {
    // response is "What the ***"
});
```

### Highlighting Profane Words & Phrases

Sometimes it is useful to leave the original profane word/phrase intact
but wrap it in some sort of tag to make it stand out. This can be
accomplished with the `.highlight(corpus, [start_tag, end_tag, [language,]], callback)` method.

```js
client.highlight("What the hell", "<blink>", "</blink>", function(response) {
   // response is "What the <blink>hell</blink>"
});
```

The start and end tag parameters are optional, but a end_tag should be provided if a start tag is provided. The &lt;strong&gt; tag will be used if
they are not provided.

```js
client.highlight("What the hell", function(response) {
    // response is "What the <strong>hell</strong>"
})
```

### Checking Japanese Text for Profanity.

Bomberman supports for checking Japanese text for profanity.
To do this pass an optional language argument with the value `"ja"` as the
language parameter to the above methods.

```js
client.isProfane("聖パトリックの日", "ja", function(response) {
    // response is false
});
```

For more info on customizing Bomberman please refer to the [add-on documentation](http://bomberman.ikayzo.com/).
## Troubleshooting

We are just starting out.  If you experience trouble please contact us
at <bomberman-support@ikayzo.com>.

## Contributing

Given the early stage of this project we are open to comments &
suggestions for this library please send them to <bomberman-support@ikayzo.com>.
