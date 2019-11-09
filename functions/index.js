const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");
const FBAuth = require("./util/fbAuth");

const {
  getAllPaintings,
  postOnePainting,
  getPainting,
  commentOnPainting,
  likePainting,
  unlikePainting,
  deletePainting
} = require("./handlers/paintings");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");

app.get("/paintings", getAllPaintings);
app.post("/paintings", FBAuth, postOnePainting);
app.get("/paintings/:paintingId", getPainting);
app.delete("/paintings/:paintingId", FBAuth, deletePainting);
app.get(`/paintings/:paintingId/like`, FBAuth, likePainting);
app.get(`/paintings/:paintingId/unlike`, FBAuth, unlikePainting);
app.post("/paintings/:paintingId/comment", FBAuth, commentOnPainting);

app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

//Post a painting

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
.onCreate((snapshot) => {
  db.doc(`/paintings/${snapshot.data().paintingId}`).get()
  .then(doc => {
    if(doc.exists){
      return db.doc(`/notifications/${snapshot.id}`).set({
        createdAt: new Date().toISOString;
      })
    }
  })
})