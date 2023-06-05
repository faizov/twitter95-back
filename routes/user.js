const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/user.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars/");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}.png`);
  },
});
const upload = multer({ storage: storage });

module.exports = () => {
  router.get("/:id", userController.getUser);
  router.put(
    "/uploadavatar",
    upload.single("file"),
    userController.uploadAvatar
  );
  router.put("/edit", userController.editUser);
  return router;
};
