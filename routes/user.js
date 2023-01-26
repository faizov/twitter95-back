const userModel = require("../models/user");
const tweetModel = require("../models/tweet");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars/");
  },
  filename: function (req, file, cb) {
    console.log("file", req.user.id);
    cb(null, `${req.user.id}.png`);
  },
});
const upload = multer({ storage: storage });

module.exports = (app) => {
  app.get("/user/:id", async (req, res) => {
    const user = await userModel.findOne({ id: req.params.id });

    try {
      tweetModel.find(
        { authorId: req.params.id },
        null,
        { sort: { id: -1 } },
        (err, tweets) => {
          if (err) return res.send(err);

          const body = {
            user: user,
            tweets: tweets.reverse(),
          };

          res.send(body);
        }
      );
    } catch (error) {
      res.send(error);
    }
  });

  app.post("/user/uploadavatar", upload.single("file"), async (req, res) => {
    const user = req.user;

    try {
      userModel.findOne({ id: user.id }, async function (err, user) {
        if (err) {
          return err;
        }
        if (user && req.file) {
          user.photo = "http://localhost:3001/avatars/" + req.file.filename;

          user.save();
          res.send(user);
        }
      });
    } catch (error) {}
  });

  app.put("/user/edit", async (req, res) => {
    const updateUser = new userModel(req.body);

    userModel.findOneAndUpdate(
      { _id: req.body._id },
      { bio: updateUser.bio, name: updateUser.name },
      { upsert: true, setDefaultsOnInsert: true },
      function (err, userUpdate) {
        return res.json(userUpdate);
      }
    );
  });
};
