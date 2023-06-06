const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  authorId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
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
  comments: [
    {
      author: { id: Number, name: String, avatar: String },
      text: String,
      date: Date,
    },
  ],
});

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;
