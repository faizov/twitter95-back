const express = require("express");
const router = express.Router();
const tweetsController = require("../controllers/tweets.controller");

module.exports = () => {
  router.get("/", tweetsController.getTweets);
  router.get("/:id", tweetsController.getTweetById);
  router.post("/", tweetsController.addTweet);
  router.delete("/:id", tweetsController.deleteTweet);
  router.patch("/:id/like", tweetsController.likeTweet);
  router.post("/:id/comments", tweetsController.addComment);
  router.get("/:id/comments", tweetsController.getComments);
  return router;
};
