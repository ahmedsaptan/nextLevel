const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors());

app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    key: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { data: {}, errors: {} });
});
app.use("/api", require("./routes/index"));

app.use(function (req, res, next) {
  next(createError(404));
});

//ERROR Handler
app.use((err, req, res, next) => {
  console.log("errrrrrr", err);
  res.status(err.status || 500).json({
    error: Array.isArray(err.message) ? err.message[0].msg : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`SERVER IS ON AT PORT ${PORT}`);
});
