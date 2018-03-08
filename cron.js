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
cron.schedule('*/5 * * * * *', () => {
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

    //parse json from server

    //response is string obj, so this must be parsed.
    const stages_parsed = JSON.parse(response).result;
    const regular_parsed = stages_parsed.regular;
    const gachi_parsed= stages_parsed.gachi;
    const league_parsed = stages_parsed.league;

    /*
    console.log(regular_parsed);
    console.log(gachi_parsed);
    console.log(league_parsed);
    */

    //refresh stage info on firebase realtimedb
    const db = firebase_admin.database();
    const ref = db.ref('stages');
    //check whether the latest info is already pushed.

    let latest_date_t = 0;

    regular_parsed.forEach((item) => {
      //item.start_t is a mSec for Date obj
      if (latest_date_t < item.start_t) {
        latest_date_t = item.start_t;
      }
    });

    console.log(latest_date_t);
    const regular_ref = ref.child("regular/stage");

    //compare info between json and db.
    regular_ref.once("value").then((snapshot) => {
      let toBeRefreshed = false;
      snapshot.forEach((childSnapshot) => {
        if (latest_date_t > childSnapshot.child("start_t").val()) {
          console.log("Start sync");
          toBeRefreshed = true;
        } else {
          toBeRefreshed = false;
        }
      });
      return toBeRefreshed;
    }).then((toBeRefreshed) => {
      console.log("toBeRefreshed:", toBeRefreshed);
      if (toBeRefreshed) {
        //remove all stage info from DB
        ref.remove();
        pushAllItems(regular_parsed, "regular");
        pushAllItems(gachi_parsed, "gachi");
        pushAllItems(league_parsed, "league");

      } else {
        console.log("Log:Info on DB is up-to-date");
        //nothing to do.
      }
    }).catch((err) => {
      console.error("Error: ", err);
      return false;
    });
  });
});

let pushAllItems = (stages_json, rule) => {
  //TODO: json obj has to be validated.
  const db = firebase_admin.database();
  const ref = db.ref('stages/' + rule + '/stage/');
  stages_json.forEach((item) => {
    ref.push({
      rule: item.rule,
      rule_type: item.rule_ex.name,
      stage_A:item.maps[0],
      stage_B:item.maps[1],
      start_t: item.start_t,
      start: item.start
    }).catch((err) => {
      console.error("Error: ", err);
    });
  });
}
