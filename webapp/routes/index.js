var express = require('express');
var router = express.Router();
var https = require('https');
var config = require('../../config.json');
var eventsURL = "https://api.keen.io/3.0/projects/" + config.projectId + "/queries/extraction?api_key=" + config.readKey + "&event_collection=rfid&latest=1";

var timeout = 10000; // Milliseconds of tolerance before card authorization no longer valid
var authorizedUIDs = ['10,116,105,79']; // Add yours as necessary

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'RFID Auth demo app' });
});

router.get('/secret', function (req, res) {
  getEvents(function (allData) {
    var data = allData.data;
    var timestamp = allData.keen.timestamp;
    var lastLogged = Date.now() - Date.parse(timestamp);

    // There is a card
    if(lastLogged < timeout) {
      // The card is authorized
      if(authorizedUIDs.indexOf(data.uid.toString()) > -1) {
        // Show secret page
        res.render('secret', { title: 'Super secret mystery page', data:data, authorizedUIDs: authorizedUIDs });
      } else {
        // Card not authorized
        var err = new Error('Card ' + data.uid.toString() + ' is not authorized to view the secret.');
        err.status = 403;
        res.render('error', { error: err });
      }
    } else {
      // No card present
      var err = new Error('No card present. Last card logged ' + lastLogged/1000 + ' seconds ago.');
      err.status = 403;
      res.render('error', { error: err });
    }
  });
});

module.exports = router;

function getEvents(callback) {
  https.get(eventsURL, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      callback(JSON.parse(d.toString()).result[0]);
    });

  }).on('error', function(e) {
    console.error(e);
  });
}
