const firebase_admin = require('firebase-admin');
const serviceAccount = require('./ikaassistant-auth-key.json');
firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: "https://ikaassistant-e5b63.firebaseio.com"
});

let pushAllItems = (stages_json, rule) => {

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

exports.pushAllItems = pushAllItems;
