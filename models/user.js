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
  photo: {
    type: String,
    require,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
