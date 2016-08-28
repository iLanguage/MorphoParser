(function(exports) {
  /* globals FieldDB, alert */
  var NonContentWords = exports.NonContentWords || require('./NonContentWords').NonContentWords;
  var LexemeFrequency = exports.LexemeFrequency || require('./LexemeFrequency').LexemeFrequency;
  var MorphemeSegmenter = exports.MorphemeSegmenter || require('./MorphemeSegmenter').MorphemeSegmenter;
  var Q = Q || exports.FieldDB ? exports.FieldDB.Q : require("q");

  // Accept injected Lexicon functionality
  var BASE_LEXICON = exports.Lexicon || Object;
  var BASE_LEXICON_NODE = BASE_LEXICON.LexiconNode || Object;
  var BASE_LEXICON_FACTORY = BASE_LEXICON.LexiconFactory || function(options) {
    console.warn("No lexicon factory was injected. This lexicon will not accept precedence rules or word frequencies.");
    var lex = new Lexicon(options);
    if (lex.orthography && (!lex.wordFrequencies || lex.wordFrequencies.length === 0) && typeof Lexicon.bootstrapLexicon === "function") {
      Lexicon.bootstrapLexicon(lex);

      lex.wordFrequencies = lex.wordFrequencies || [];

      for (var wordIndex in lex.wordFrequencies) {
        if (!lex.wordFrequencies.hasOwnProperty(wordIndex)) {
          continue;
        }
        var word = lex.wordFrequencies[wordIndex];
        if (typeof word === "string") {
          word = {
            orthography: word
          };
        }
        /* accept Datum as words */
        if (!word.fields && word.fields) {
          word.fields = word.fields;
        }
        if (!word.fields) {
          word.fields = {};
        }
        if (word.orthography && !word.fields.orthography) {
          word.fields.orthography = word.orthography;
          delete word.orthography;
        }
        word.count = word.count || 0;
        word.categories = word.categories || [];
        word.datumids = word.datumids || word.docids || [];
        if (lex._id) {
          word.datumids.push(lex._id);
        }
        if (lex.url) {
          word.url = lex.url;
        }
        if (lex.length > Lexicon.maxLexiconSize) {
          console.warn("Ignoring lexical entry (lexicon has reached max size " + Lexicon.maxLexiconSize + ") ", word);
          continue;
        }
        lex.add(new LexiconNode(word));
      }
    }

    return lex;
  };

  try {
    // // BASE_LEXICON = require('fielddb-glosser/lib/Lexicon').Lexicon;
    // BASE_LEXICON_NODE = BASE_LEXICON.LexiconNode;
    // BASE_LEXICON_FACTORY = BASE_LEXICON.LexiconFactory;
  } catch (exception) {
    console.warn("Can't use fielddb-glosser, its probably not availible");
  }

  var LexiconNode = function(options) {
    for (var property in options) {
      if (options.hasOwnProperty(property)) {
        this[property] = options[property];
      }
    }
    BASE_LEXICON_NODE.call(this);
  };
  LexiconNode.prototype = Object.create(BASE_LEXICON_NODE.prototype, {
    constructor: {
      value: LexiconNode
    }
  });

  var Lexicon = function(options) {
    this.collection = options.collection || [];
    for (var property in options) {
      if (options.hasOwnProperty(property)) {
        this[property] = options[property];
      }
    }
    BASE_LEXICON.call(this);
  };
  Lexicon.prototype = Object.create(BASE_LEXICON.prototype, {
    constructor: {
      value: Lexicon
    },

    length: {
      get: function() {
        return this.collection.length;
      },
      set: function() {}
    },

    add: {
      value: function(item) {
        this.collection.unshift(item);
      }
    },

    getLexicalEntries: {
      value: function(lexicalEntryToMatch) {
        if (BASE_LEXICON.prototype.getLexicalEntries) {
          console.log("Calling super getLexicalEntries");
          return BASE_LEXICON.prototype.getLexicalEntries(this, arguments);
        }

        var deffered = Q.defer(),
          matches = [],
          self = this;

        console.log("Getting matching entrys for ", lexicalEntryToMatch, " from ", this.collection);

        if (!lexicalEntryToMatch) {
          deffered.resolve(matches);
        } else {
          this.collection.map(function(entry) {
            if (!entry || !entry.fields) {
              return;
            }
            var orthographyToMatch = lexicalEntryToMatch;
            if (orthographyToMatch.fields && orthographyToMatch.fields.orthography) {
              orthographyToMatch = orthographyToMatch.fields.orthography;
            } else if (orthographyToMatch.orthography) {
              orthographyToMatch = orthographyToMatch.orthography;
            }
            
            if (entry.fields.orthography === orthographyToMatch) {
              matches.unshift(entry);
            } else {
              console.log("This entry ", entry, "doesnt match", lexicalEntryToMatch);
            }
          });
        }
        deffered.resolve(matches);

        return deffered.promise;
      }
    }
  });


  var LexiconFactory = function(options) {
    var lex = BASE_LEXICON_FACTORY.apply(this, [options]);

    console.log(lex.length);
    return lex;
  };

  Lexicon.NonContentWords = NonContentWords;
  Lexicon.LexemeFrequency = LexemeFrequency;
  Lexicon.LexiconNode = LexiconNode;
  Lexicon.LexiconFactory = LexiconFactory;
  Lexicon.MorphemeSegmenter = MorphemeSegmenter;
  Lexicon.maxLexiconSize = BASE_LEXICON.maxLexiconSize || 10000;
  Lexicon.bootstrapLexicon = BASE_LEXICON.bootstrapLexicon = Lexicon.LexemeFrequency.calculateNonContentWords;

  exports.Lexicon = Lexicon;
  try {
    global.Lexicon = Lexicon;
  } catch (e) {
    console.log(e);
  }

  // }(typeof exports === 'object' && exports || this));
})(typeof exports === 'undefined' ? this : exports);
