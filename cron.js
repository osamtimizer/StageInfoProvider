const firebase_admin = require('firebase_admin');
const serviceAccount = require('./ikaassistant-auth-key.json');

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: "https://ikaassistant-e5b63.firebaseio.com"
});

let cron = require('node-cron');
//this task must be executed every 2 hours.
cron.schedule('* * * * * *', () => {
  console.log("hello nodejs");
  //prepare HTTP request
  //
  //send request
  //
  //parse json from server
  //
  //refresh stage info on firebase realtimedb
});
