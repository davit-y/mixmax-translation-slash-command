// Based on code for Type Ahead API of SoundCloud slash command
// https://github.com/simonxca/mixmax-soundcloud-slash-command

var request = require('request');
var _ = require('underscore');

// A subset of available languages
var languages = ["French","Spanish","Russian","Italian","Finnish"];

// The Type Ahead API.
module.exports = function(req, res) {
  var searchTerm = req.query.text;

  // If a user has selected a valid language, then it will be the prefix of the string
  var selectedLanguage = _.find(languages, function(key) {
    return searchTerm.indexOf(key + ': ') === 0; // Search prefix.
  });

  // If the user doesn't have a valid language selected, then assume they're still searching languages.
  if (!selectedLanguage) {
    var matchingLanguages = _.filter(languages, function(language) {
      // Show all languages if there is no search string
      if (searchTerm.trim() === '') return true;

      return language.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
    });

    if (matchingLanguages.length === 0) {
      res.json([{
        title: "<i>(language not found)</i>",
        text: ''
      }]);
    } else {
      res.json(matchingLanguages.map(function(language) {
        return {
          title: language,
          text: language + ': ',
          resolve: false // Don't automatically resolve and remove the text (keep searching instead).
        };
      }));
    }
  }
};