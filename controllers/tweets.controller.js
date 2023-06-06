const mongoose = require("mongoose");

const tweetModel = require("../models/tweet");
const userModel = require("../models/user");

module.exports = {
  getTweets: async (req, res) => {
    try {
      const tweets = await tweetModel.find({}).sort({ _id: -1 });
      res.send(tweets);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tweets" });
    }
  },
  getTweetById: async (req, res) => {
    try {
      const tweetId = req.params.id;
      const tweet = await tweetModel.findById(tweetId);
      if (!tweet) {
        throw new Error("Tweet not found");
      }
      res.send(tweet);
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
  addTweet: async (req, res) => {
    const { text, name } = req.body;
    const author = req.user.id;

    try {
      const tweet = await tweetModel.create({
        authorId: author,
        name: name,
        text,
        date: new Date().toLocaleString(),
      });
      res.send(tweet);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to add tweet" });
    }
  },
  deleteTweet: async (req, res) => {
    const tweetId = req.params.id;
    await tweetModel.findByIdAndDelete(tweetId);
    const tweets = await tweetModel.find({}).sort({ _id: -1 });

    try {
      res.send(tweets);
    } catch (error) {
      res.send(error);
    }
  },
  likeTweet: async (req, res) => {
    const tweetId = req.params.id;
    const userId = req.user.id;
    const user = await userModel.findOne({ id: userId });
    const tweet = await tweetModel.findById(tweetId);

    try {
      await tweetModel.findByIdAndUpdate(tweetId, {
        $inc: { likes: user.likes.includes(tweetId) ? -1 : 1 },
        lastModified: new Date(),
      });

      if (!user.likes.includes(tweetId)) {
        await userModel.findOneAndUpdate(
          { id: req.user.id },
          { $push: { likes: tweetId } }
        );
      } else {
        await userModel.findOneAndUpdate(
          { id: req.user.id },
          { $pull: { likes: tweetId } }
        );
      }

      res.send(tweet);
    } catch (error) {
      res.status(500).send({ error: "Failed to like tweet" });
    }
  },
  addComment: async (req, res) => {
    const tweetId = req.params.id;

    const { text } = req.body;
    const authorId = req.user.id;
    const user = await userModel.findOne({ id: authorId });

    try {
      const tweet = await tweetModel.findById(tweetId);

      if (!tweet) {
        throw new Error("Tweet not found");
      }

      const comment = {
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        text,
        date: new Date(),
      };

      tweet.comments.push(comment);
      await tweet.save();

      res.send(comment);
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ error: "Failed to add comment" });
    }
  },
  getComments: async (req, res) => {
    const tweetId = req.params.id;

    try {
      const tweet = await tweetModel.findById(tweetId);
      if (!tweet) {
        throw new Error("Tweet not found");
      }

      const comments = tweet.comments.reverse();
      res.send(comments);
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
};
