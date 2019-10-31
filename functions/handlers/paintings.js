const { db } = require("../util/admin");

exports.getAllPaintings = (req, res) => {
  db.collection("Paintings")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let paintings = [];
      data.forEach(doc => {
        paintings.push({
          paintingId: doc.id,
          body: doc.data().body,
          Artist: doc.data().Artist,
          ArtWork: doc.data().ArtWork,
          Price: doc.data().Price,
          createdAt: doc.data().createdAt
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
    createdAt: new Date().toISOString()
  };

  db.collection("Paintings")
    .add(newPainting)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
