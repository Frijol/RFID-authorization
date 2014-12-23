// var Keen = require('keen.io');
var tessel = require('tessel');
var rfid = require('rfid-pn532').use(tessel.port['A']);

var pollPeriod = 500;
var authorized = false;
var countdown;

rfid.on('ready', function () {
  console.log('RFID reader ready and waiting.');
  rfid.setPollPeriod(pollPeriod);
});

rfid.on('data', function (data) {
  console.log(data.uid);
  clearTimeout(countdown);
  authorized = true;
  console.log('authorized:', authorized);
  countdown = setTimeout(function () {
    authorized = false;
    console.log('authorized:', authorized);
  }, pollPeriod + 500);
});



// console.log("Setting up Keen...");
// var keen = Keen.configure({
//   projectId: "5499e47dd2eaaa02d8b3fcb6",
//   writeKey: "0cc3835d31febd0a0529d85be44f97cd7dcaabc24a7296925d91ca39b1eb04e76b99f7dba8bad3b6edc74099f1d81cded4ecf6fcf7ec634e8418557589b6ab894b8f4baea24735483168769e9185d9384b81e0a704fae587b6848ae7157ac2c7c2b47095c149b77076d8a9f1e31abca4",
//   readKey: "4011e80b28e4e0962fc0672a1f165a200d189a7ae12a165f8f9c2809ae8596bfcd7ccab4fcba569f32160675a7940658be34f4cfea8992f610c13154fb680f706e0323811c1b3b037a1db68c4bd06e9fdec5ac9d50bdff03d9c62c45e85e7946502079284c38d694b375bb82b21ea5f9"
// });
//
// // every second send up all the accelerometer data
// setTimeout(function sendData(){
//   keen.addEvent("accel", {data: dataArray}, function(err){
//     if (err) throw err;
//
//     console.log("Added event #"+count, "data: ", dataArray);
//     count++;
//     dataArray = [];
//     setTimeout(sendData, 1000);
//   });
// }, 1000);
