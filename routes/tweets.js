const tweetModel = require("../models/tweet");
const userModel = require("../models/user");

module.exports = (app) => {
  app.get("/tweets", (req, res) => {
    try {
      tweetModel.find({}, null, { sort: { _id: -1 } }, (err, tweets) => {
        if (err) return res.send(err);
        res.send(tweets);
      });
    } catch (error) {
      console.log("error", error);
    }
  });

  app.post("/tweets/add", async (req, res) => {
    try {
      const newData = req.body;
      newData.authorId = req.user.id;
      newData.date = new Date().toLocaleDateString();

      const tweet = new tweetModel(newData);
      await tweet.save();

      res.sendStatus(200);
    } catch (error) {
      res.send(error);
    }
  });

  app.get("/tweets/:id", async (req, res) => {
    const tweetId = req.params.id;
    tweetModel.findById(tweetId, function (error, tweet) {
      try {
        if (error) {
          throw new Error("Tweet not found");
        }
        res.send(tweet);
      } catch (error) {
        res.status(404).send(error.message);
      }
    });
  });

  app.delete("/tweets/:id", async (req, res) => {
    const tweetId = req.params.id;
    await tweetModel.findByIdAndDelete(tweetId);

    try {
      res.send(tweet);
    } catch (error) {
      res.send(error);
    }
  });

  app.patch("/tweets/:id/like", async (req, res) => {
    const tweetId = req.params.id;
    const userId = req.user.id;
    const user = await userModel.findOne({ id: userId });
    const tweet = await tweetModel.findById(tweetId);

    try {
      if (!user.likes.includes(tweetId)) {
        tweet.likes += 1;
        tweet.lastModified = new Date();

        await userModel.findOneAndUpdate(
          { id: req.user.id },
          {
            $push: { likes: tweetId },
          }
        );

        await tweet.save();
        res.send(tweet);
      } else {
        tweet.likes -= 1;

        await userModel.findOneAndUpdate(
          { id: req.user.id },
          {
            $pull: { likes: tweetId },
          }
        );

        await tweet.save();
        res.send(tweet);
      }
    } catch (error) {
      res.send(error);
    }
  });
};
