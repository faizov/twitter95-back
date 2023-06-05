const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "274152928927-1c0o33ibd0ur510f1hvjdd219pkpcmb4.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3001/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        if (profile) {
          const { sub, name, given_name, picture, email } = profile._json;

          const payload = {
            id: Number(sub),
            name: name,
            email: email,
            avatar: "",
            banner: "",
          };

          userModel.findOne({ id: Number(sub) }, async function (err, user) {
            if (err) {
              return cb(err);
            }

            if (!user) {
              const newUser = new userModel(payload);

              await newUser.save();
            }

            return cb(null, payload);
          });
        }
      }
    )
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/",
    }),
    function (req, res) {
      const userId = req.user.id;

      const options = {
        expiresIn: "1d",
      };

      const token = jwt.sign({ id: userId }, "yoursecretkey", options);
      res.redirect(`http://localhost:3000/auth?token=${token}`);
    }
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      cb(null, user.id);
    });
  });

  passport.deserializeUser(function (user, cb) {
    return cb(null, user);
  });

  app.use((req, res, next) => {
    const token = req.headers.authorization;

    try {
      const decoded = jwt.verify(token, "yoursecretkey");
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  });
};
