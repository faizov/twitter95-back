const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
});

const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
  session({
    secret: "yoursecretkey",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));

const authRoutes = require("./routes/auth");
const userRouter = require("./routes/user");
const tweetsRoutes = require("./routes/tweets");

authRoutes(app);
userRouter(app);
tweetsRoutes(app);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
