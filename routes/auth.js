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
            id: sub,
            name: name,
            email: email,
            photo: "",
          };

          userModel.findOne({ id: sub }, async function (err, user) {
            if (err) {
              return cb(err);
            }

            if (!user) {
              const newUser = new userModel(payload);

              await newUser.save();
            }
            console.log('payload', payload)
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
      console.log('req.user', req.user)
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

  // app.post("/auth/login", async (req, res) => {
  //   const { email, password } = req.body;
  //   const user = await userModel.findOne({ email });

  //   if (!user)
  //     return res.status(401).send({ message: "Invalid email or password" });

  //   const isPasswordValid = await bcrypt.compare(password, user.hashPass);
  //   if (!isPasswordValid)
  //     return res.status(401).send({ message: "Invalid email or password" });

  //   req.session.userId = user._id;
  //   res.status(200).send(user);
  // });

  // app.post("/auth/register", async (req, res) => {
  //   const userData = req.body;
  //   const { email, name, nickName, password } = userData;
  //   const checkEmail = await userModel.findOne({ email: email });
  //   const checkNickName = await userModel.findOne({
  //     nickName: nickName,
  //   });

  //   if (email && nickName && name && password) {
  //     if (!checkEmail && !checkNickName && validator.isEmail(email)) {
  //       const user = new userModel(userData);

  //       bcrypt.hash(userData.password, 10, async function (err, hash) {
  //         if (err) return console.error(err);
  //         if (hash) {
  //           user.hashPass = hash;
  //           console.log("user", user);
  //           await user.save();
  //           // req.session.userId = user._id;
  //           res.sendStatus(200);
  //         }
  //       });
  //     } else {
  //       return res.status(400).send({
  //         message: "Email or password missing.",
  //       });
  //     }
  //   } else {
  //     res.sendStatus(401);
  //   }

  //   app.get("/user", async (req, res) => {
  //     const user = await userModel.findOne({ _id: req.body._id });
  //     try {
  //       res.send(user);
  //     } catch (error) {
  //       res.send(error);
  //     }
  //   });
  // });
};
