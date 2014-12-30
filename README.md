RFID-authorization
==================

Allows a user to access a page only if an authorized RFID card is present.

Uses a Tessel with an RFID module to sense an RFID card. When RFID card is sensed, the UID is sent over Tessel's Wifi to a Keen.io database.

When you try to access the secret page on the website (running on a separate Node server), it checks the Keen database to see if you should be allowed to access the page.

## Materials

* [Tessel](//tessel.io)
* [RFID Module](//tessel.io/modules#module-rfid)

## Prereqs

1. Get a [Keen](https://keen.io/organizations/5499e47dd2eaaa02d8b3fcb5) account.
1. [Install Tessel](//start.tessel.io)

## Setup

1. Clone this repo.
1. Make a new project on Keen.
1. Make a config.json in the main folder, following example-config.json and use the keys from your new Keen project.
1. Once you've set up your config.json in the main directory, also copy it into the 'tessel' folder.
1. In the "webapp" folder, `npm install` to install dependencies, and then run an instance of the app (`node ./bin/www`)
1. In a separate terminal window, in the "tessel" folder, `npm install` to install dependencies
1. Make sure tessel is [connected to wifi](start.tessel.io/wifi), then run the app with `tessel run index.js`. Once it's set up, if you put a card on the reader, it should log to Keen.
1. Go to the Node instance in your browser and try to access the secret page. You'll probably want to add an authorized RFID card to the variable `authorizedUIDs` in webapp/routes/index.js
1. Muck around with it. What polling rate do you want? How long of a timeout do you want on authorization? There's plenty to poke around with in tessel's index.js and the webapp's route's index.js
