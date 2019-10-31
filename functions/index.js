const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const { getAllPaintings, postOnePainting } = require("./handlers/paintings");
const { signup, login, uploadImage } = require("./handlers/users");

app.get("/paintings", getAllPaintings);
app.post("/paintings", FBAuth, postOnePainting);

app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

//Post a painting

exports.api = functions.https.onRequest(app);
