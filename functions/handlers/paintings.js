const { db } = require("../util/admin");

exports.getAllPaintings = (req, res) => {
  db.collection("paintings")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let paintings = [];
      data.forEach(doc => {
        paintings.push({
          paintingId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().likeCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        });
      });
      return res.json(paintings);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOnePainting = (req, res) => {
  const newPainting = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("paintings")
    .add(newPainting)
    .then(doc => {
      const resPainting = newPainting;
      resPainting.paintingId = doc.id;
      res.json(resPainting);
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.getPainting = (req, res) => {
  let paintingData = {};
  db.doc(`/paintings/${req.params.paintingId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Painting not found" });
      }
      paintingData = doc.data();
      paintingData.paintingId = doc.id;
      return db
        .collection("Comments")
        .orderBy("createdAt", "desc")
        .where("paintingId", "==", req.params.paintingId)
        .get();
    })
    .then(data => {
      paintingData.comments = [];
      data.forEach(doc => {
        paintingData.comments.push(doc.data());
      });
      return res.json(paintingData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnPainting = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    paintingId: req.params.paintingId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/paintings/${req.params.paintingId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Painting does not exist" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection(`comments`).add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

//like a painting
exports.likePainting = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("paintingId", "==", req.params.paintingId)
    .limit(1);

  const paintingDocument = db.doc(`/paintings/${req.params.paintingId}`);

  let paintingData;

  paintingDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        paintingData = doc.data();
        paintingData.paintingId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Painting not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            paintingId: req.params.paintingId,
            userHandle: req.user.handle
          })
          .then(() => {
            paintingData.likeCount++;
            return paintingDocument.update({
              likeCount: paintingData.likeCount
            });
          })
          .then(() => {
            return res.json(paintingData);
          });
      } else {
        return res.status(400).json({ error: "Painting already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikePainting = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("paintingId", "==", req.params.paintingId)
    .limit(1);

  const paintingDocument = db.doc(`/paintings/${req.params.paintingId}`);

  let paintingData;

  paintingDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        paintingData = doc.data();
        paintingData.paintingId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Painting not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "Painting not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            paintingData.likeCount--;
            return paintingDocument.update({
              likeCount: paintingData.likeCount
            });
          })
          .then(() => {
            res.json(paintingData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deletePainting = (req, res) => {
  const document = db.doc(`/paintings/${req.params.paintingId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Painting not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Painting deleted succesfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
