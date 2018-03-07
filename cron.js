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
  const user_agent = "StageInfoProvider/0.1 (twitter @osamtimizer)";

  //This url should be changed to other unofficial API server because the Cookie will be expired within 48 hours on official API server.
  const url = "https://app.splatoon2.nintendo.net/api/schedules";
  const url_unofficial_schedule_battle = "https://spla2.yuu26.com/schedule";
  const url_unofficial_schedule_albeit = "https://spla2.yuu26.com/coop/schedule";

  //Cookie(iksm_session) is not required for unofficial API server.
  //User-Agent should be set instead.
  const headers = {
    "User-Agent": user_agent
  };

  const options = {
    url: url_unofficial_schedule_battle,
    method: "GET",
    headers: headers
  };

  //send request
  request(options).then((response) => {
    console.log("json obj has been fetched correctly.");

    //parse json from server

    //response is string obj, so this must be parsed.
    const stages_parsed = JSON.parse(response).result;
    const regular_parsed = stages_parsed.regular;
    const gachi_parsed= stages_parsed.gachi;
    const league_parsed = stages_parsed.league;

    console.log(regular_parsed);
    console.log(gachi_parsed);
    console.log(league_parsed);

    //refresh stage info on firebase realtimedb
    const db = firebase_admin.database();
    const ref = db.ref('stages');
    //check whether the latest info is already pushed.


    //TODO: compare info between json and db.
    if (true) {
      /*
      const ref_push = ref.push();
      ref_push.set({
        rule: "gachi",
        stage_name: "TEST",
        start_time: "21:00",
        date: "0307"
      }, (err) => {
        if (err) {
          console.error("Error: ", err);
        } else {
          console.log("Log:DB push success");
        }
      });
      */
    } else {
      console.log("Log:Info on DB is up-to-date");
      //nothing to do.
    }
  }).catch((err) => {
    console.error("Error: ", err);
    return false;
  });

});
