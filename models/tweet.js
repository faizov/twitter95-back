const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
  id: {
    type: Number,
    require,
  },
  authorId: {
    type: String,
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
    require,
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

// const mongoose = require("mongoose");

// const TweetSchema = new mongoose.Schema({
//   id: {
//     type: Number,
//     require,
//   },
//   authorInfo: {
//     id: String,
//     name: String,
//     photo: String,
//   },
//   text: {
//     type: String,
//     require,
//   },
//   date: {
//     type: String,
//     require,
//   },
//   likes: {
//     type: Number,
//     default: 0,
//   },
// });

// const Tweet = mongoose.model("Tweet", TweetSchema);

// module.exports = Tweet;
