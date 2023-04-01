const tweetModel = require("../models/tweet");
const userModel = require("../models/user");
const mongoose = require("mongoose");

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

  app.post("/tweets", async (req, res) => {
    const { text } = req.body;
    const author = req.user.id;

    try {
      const tweet = new tweetModel({
        author: author,
        text,
        date: new Date().toLocaleString(),
      });
      await tweet.save();
      res.send(tweet);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
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

  app.post("/tweets/:id/comments", async (req, res) => {
    try {
      const tweet = await Tweet.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            comments: {
              authorId: req.body.authorId,
              name: req.body.name,
              avatar: req.body.avatar,
              nickname: req.body.nickname,
              text: req.body.text,
              date: req.body.date,
            },
          },
        },
        { new: true }
      );
      res.send(tweet);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
