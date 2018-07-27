'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

String.prototype.toDateFromDatetime = function() {
    var parts = this.split(/[- :]/);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
};

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _config = require('./config');

var moment = require('moment');
// moment.locale('pt-BR');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Scraping matches
 * 
 * @export
 * @class Upcoming
 */
var Upcoming =

/**
 * Creates an instance of Upcoming.
 * 
 * @param {any} callback 
 * 
 * @memberOf Upcoming
 */
function Upcoming(callback) {
  _classCallCheck(this, Upcoming);

  var uri = _config.CONFIG.BASE + '/' + _config.CONFIG.UPCOMING;

  (0, _request2.default)({ uri: uri }, function (error, response, body) {

    var $ = _cheerio2.default.load(body, {
      normalizeWhitespace: true
    });

    var results = [],
        matchesContent = $('.contentCol').find('.upcoming-matches'),
        days,
        dayResults,
        matchDate,
        matches;

    days = $(matchesContent).find('.match-day');

    $(days).each(function (i, element) {
      matchDate = $(element).find('.standard-headline').text();
      matches = $(element).find('.upcoming-match');

      $(matches).each(function (m, match) {
        var el = $(match).find('tr');
        var event = el.children('.event');
        var time = el.children('.time').children('.time').text();
        var team1 = el.children('.team-cell').first();
        var team2 = el.children('.team-cell').last();
        var matchId = $(match).attr('href');
        var maps = el.find('.map-text');
        var dateTime = matchDate + ' ' + time + ':00';
        var date = moment(dateTime);
        date.set('hour', (date.get('hour') - 5));

        var objData = {
          event: {
            name: event.find('.event-name').text(),
            crest: event.find('.event-logo').attr('src')
          },
          maps: maps.text(),
          team1: {
            name: team1.find('.team').text(),
            crest: team1.find('img').attr('src')
          },
          team2: {
            name: team2.find('.team').text(),
            crest: team2.find('img').attr('src')
          },
          matchId: matchId,
          date: date.format('YYYY-MM-DD'),
          time: date.format('HH:mm:ss')
        };
        results.push(objData);
      });
    });

    callback(results, error);
  });
};

exports.default = Upcoming;