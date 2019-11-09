var admin = require("firebase-admin");
var serviceAccount = require("./key-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://art-app-32060.firebaseio.com",
  storageBucket: "art-app-32060.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };
