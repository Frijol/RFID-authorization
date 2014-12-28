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
  // Notify user
  tessel.led[2].output(1);
  console.log('RFID reader ready and waiting.');
  // Slow down data rate
  rfid.setPollPeriod(pollPeriod);
});

// When RFID card sensed
rfid.on('data', function (data) {
  console.log(data.uid);
  clearTimeout(countdown);
  // If it wasn't already there
  if (!present) {
    present = true;
    console.log('card present:', present);
    // Log the data
    sendData({uid: data.uid, present: present});
  }
  // Make sure card is still there
  countdown = setTimeout(function () {
    // If it's not, log the change
    present = false;
    console.log('card present:', present);
    sendData({uid: data.uid, present: present});
  }, pollPeriod + 500);
});

// Sending data to Keen
function sendData (data) {
  keen.addEvent('rfid', {data: data}, function () {
    console.log("Added event #" + count, "data: ", data);
    count++;
  });
}
