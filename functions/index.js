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
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
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
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

//Post a painting

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/paintings/${snapshot.data().paintingId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch(err => console.error(err));
  });

exports.deleteNotificationOnUnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });
exports.createNotifcationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/paintings/${snapshot.data().paintingId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            paintingId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("Image has changed");
      const batch = db.batch();
      return db
        .collection("paintings")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const painting = db.doc(`/paintings/${doc.id}`);
            batch.update(painting, {
              userImage: change.after.data().imageUrl
            });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onPaintingDelete = functions
  .region("us-central1")
  .firestore.document("/paintings/{paintingId}")
  .onDelete((snapshot, context) => {
    const paintingId = context.params.paintingId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("paintingId", "==", paintingId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("paintingId", "==", paintingId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("paintingId", "==", paintingId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err));
  });
