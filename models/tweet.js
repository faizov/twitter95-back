const mongoose = require("mongoose");

// const CommentSchema = new mongoose.Schema({
//   authorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   tweetId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Tweet",
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

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
      text: String,
      authorId: Number,
      date: Date,
    },
  ],
  // comments: [CommentSchema],
});

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;
