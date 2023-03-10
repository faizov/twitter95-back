const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    require,
  },
  email: {
    type: String,
    require,
  },
  name: {
    type: String,
    require,
  },
  bio: {
    type: String,
  },
  avatar: {
    type: String,
    require,
  },
  banner: {
    String,
  },
  likes: [],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
