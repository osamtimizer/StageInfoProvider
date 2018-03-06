const firebase_admin = require('firebase-admin');
const request = require('request-promise');
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
  const iksm_session = process.env.IKSM_SESSION;
  console.log(iksm_session);

  const cookie = "iksm_session=" + iksm_session;
  const url = "https://app.splatoon2.nintendo.net/api/schedules";
  const header = {
    url: url,
    Cookie: cookie,
    method: "GET"
  };

  //
  //send request
  //
  //parse json from server
  //
  //refresh stage info on firebase realtimedb
});
