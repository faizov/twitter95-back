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
    const tweet = await tweetModel.findById(tweetId);

    try {
      res.send(tweet);
    } catch (error) {
      res.send(error);
    }
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

    try {
      const tweet = await tweetModel.findOne({ id: tweetId });

      tweet.likes += 1;
      tweet.lastModified = new Date();

      await tweet.save().then();
      res.send(tweet);
    } catch (error) {
      res.send(error);
    }
  });
};
