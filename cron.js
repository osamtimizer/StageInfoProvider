const firebase_admin = require('firebase-admin');
const request = require('request-promise');
const jq = require('node-jq');
const fs = require('fs');
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
  const ua = "StageInfoProvider/0.1 (twitter @osamtimizer)";

  //This url should be changed to other unofficial API server because the Cookie will be expired within 48 hours on official API server.
  const url = "https://app.splatoon2.nintendo.net/api/schedules";
  const url_unofficial = "https://spla2.yuu26.com/schedule";

  //Cookie(iksm_session) is not required for unofficial API server.
  //User-Agent should be set instead.
  const headers = {
    "User-Agent": ua
  };

  const options = {
    url: url_unofficial,
    method: "GET",
    headers: headers
  };

  //send request
  request(options).then((result) => {
    console.log("json obj fetched");
    fs.writeFile("result.json", result);
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
