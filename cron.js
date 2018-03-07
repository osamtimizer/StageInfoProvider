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
  //prepare HTTP request
  const iksm_session = process.env.IKSM_SESSION;

  const cookie = "iksm_session=" + iksm_session;
  const url = "https://app.splatoon2.nintendo.net/api/schedules";
  const headers = {
    Cookie: cookie,
  };

  const options = {
    url: url,
    method: "GET",
    headers: headers
  };

  //send request
  request(options).then((result) => {
    console.log("json obj fetched");
    console.log(ISON.parse(result));
  }).catch((err) => {
    console.error("Error: ", err);
    return false;
  });

  //parse json from server
  //
  //refresh stage info on firebase realtimedb
  const db = firebase_admin.database();
  const ref = db.ref('stages').push();
  ref.set({
    stage_name: "TEST",
    start_time: "21:00",
    date: "0307"
  }, (err) => {
    if (err) {
      console.error("Error: ", err);
    } else {
      console.log("success");
    }
  });
});
