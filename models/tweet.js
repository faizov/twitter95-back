const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  authorId: {
    type: Number,
    require,
  },
  name: {
    type: String,
    require,
  },
  avatar: {
    type: String,
  },
  nickname: {
    type: String,
  },
  text: {
    type: String,
    require,
  },
  date: {
    type: String,
    require,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;
