const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");
const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const { getAllPaintings, postOnePainting } = require("./handlers/paintings");
const {
  signup,
  login,
  uploadImage,
  addUserDetails
} = require("./handlers/users");

app.get("/paintings", getAllPaintings);
app.post("/paintings", FBAuth, postOnePainting);
app.post("/user", FBAuth, addUserDetails);

app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);

//Post a painting

exports.api = functions.https.onRequest(app);
