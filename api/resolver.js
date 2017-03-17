// Based on code for Resolver API of the Giphy Example Slash Command
// https://github.com/mixmaxhq/giphy-example-slash-command

var request = require('request');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  handleSearchString(term, res);
};

function handleSearchString(term, res) {
  // Map of user input languages to ones necessary for API calls
  var languageMap = {
        "French":"fr",
        "Spanish":"es",
        "Russian":"ru",
        "Italian":"it",
        "Finnish":"fi"
  };
  var languageLength = term.indexOf(":");
  var fullLanguageName = term.substr(0,languageLength);
  var language = languageMap[fullLanguageName];
  var text = term.substr(languageLength + 2);

  request({
    url: 'http://www.transltr.org/api/translate',
    qs: {
        from: "en",
        to: language,
        text:text
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    var translation = response.body.translationText;

    //color will be blue if not set to inherit
    var html = '<a style="color:inherit">' + translation + '</a>';
    res.json({
      body: html,
      raw: true
    });
  });
}