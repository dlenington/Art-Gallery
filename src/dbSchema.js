let db = {
  users: [
    {
      userId: "dh23ggj5h32g543hahsjk",
      email: "user@email.com",
      handle: "user",
      createdAt: "2019-10-24T00:30:58.419Z",
      imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
      bio: "Hello, my name is user, nice to meet you",
      website: "https://user.com",
      location: "Lonodn, UK"
    }
  ],
  paintings: [
    {
      body: "this is a painting body",
      Artist: "req.body.Artist",
      ArtWork: req.body.ArtWork,
      Price: req.body.Price,
      createdAt: "2019-10-24T00:30:58.419Z"
    }
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "kajdfkajdfnklj",
      body: "nice painting",
      createdAt: "2019-10-24T00:30:58.419Z"
    }
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      paintingId: "kajdhfkaljhdfla",
      type: "like | comment",
      createdAt: "2019-10-24T00:30:58.419Z"
    }
  ]
};

const userDetails = {
  credentials: {
    userId: "NJDHSNOFMMIONEISDJKNV",
    email: "user@gmail.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image.dskjsfjnsdfkjdnksjn",
    bio: "Hello my name is user, nice to meet you",
    website: "https://user.com",
    location: "London, UK"
  },
  likes: [
    {
      userHandle: "user",
      paintingId: "31OnFoQxksnfosufnf"
    }
  ]
};
