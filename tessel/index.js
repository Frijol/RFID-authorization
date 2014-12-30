console.log('Setting up, please wait...');

var Keen = require('keen.io');

// Configuration
var config = require('./config.json');
var pollPeriod = 1000;
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
  // Notify user
  tessel.led[1].output(1);
  console.log('RFID reader ready and waiting.');
  // Slow down data rate
  rfid.setPollPeriod(pollPeriod);
});

// When RFID card sensed
rfid.on('data', function (data) {
  // Log the data
  sendData({uid: data.uid}, Date.now());
});

// Sending data to Keen
function sendData (data, time) {
  keen.addEvent('rfid', {data: data}, function () {
    console.log("Added event #" + count, "data: ", data);
    count++;
    console.log('Data send took '+ (Date.now() - time)/1000 + ' seconds to complete.');
  });
}
