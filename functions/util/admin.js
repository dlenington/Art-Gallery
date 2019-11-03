var admin = require("firebase-admin");
var serviceAccount = require("./../../art-app-32060-firebase-adminsdk-ebofm-99fccc698a.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://art-app-32060.firebaseio.com",
  storageBucket: "art-app-32060.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };
