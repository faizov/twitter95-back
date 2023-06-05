const userModel = require("../models/user");
const tweetModel = require("../models/tweet");

module.exports = {
  getUser: async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findOne({ id: id });

    if (!user) {
      return res.status(404).send("User not found");
    }

    try {
      const tweets = await tweetModel
        .find({ authorId: id })
        .sort({ _id: -1 })
        .exec();


      const body = {
        user: user,
        tweets: tweets,
      };

      res.send(body);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  },
  editUser: async (req, res) => {
    const updateUser = new userModel(req.body);
    userModel.findOneAndUpdate(
      { _id: req.body._id },
      { bio: updateUser.bio, name: updateUser.name },
      { upsert: true, setDefaultsOnInsert: true },
      async function (err, userUpdate) {
        await tweetModel.updateMany(
          { authorId: req.user.id },
          { name: updateUser.name }
        );
        return res.json(userUpdate);
      }
    );
  },
  uploadAvatar: async (req, res) => {
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
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  },
};
