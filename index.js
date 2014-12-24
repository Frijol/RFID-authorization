var Keen = require('keen.io');

// Configuration
var config = require('./config.json');
var pollPeriod = 500;
var present = false;
var countdown;
var count = 0;

// Set up hardware
var tessel = require('tessel');
var rfid = require('rfid-pn532').use(tessel.port['A']);

// Set up event streaming
console.log("Setting up Keen...");
var keen = Keen.configure({
  projectId: config.projectId,
  writeKey: config.writeKey,
  readKey: config.readKey
});

// When RFID reader is ready to read cards
rfid.on('ready', function () {
  console.log('RFID reader ready and waiting.');
  rfid.setPollPeriod(pollPeriod);
});

// When RFID card sensed
rfid.on('data', function (data) {
  console.log(data.uid);
  clearTimeout(countdown);
  if (!present) {
    present = true;
    console.log('card present:', present);
    sendData(data.uid, present);
  }
  // Make sure card is still there
  countdown = setTimeout(function () {
    present = false;
    console.log('card present:', present);
    sendData(data.uid, present);
  }, pollPeriod + 500);
});

// Sending data to Keen
function sendData (data) {
  keen.addEvent('rfid', {data: data}, function () {
    console.log("Added event #" + count, "data: ", data);
    count++;
  });
}
