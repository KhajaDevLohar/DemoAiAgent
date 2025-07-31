const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
const promisify = require("es6-promisify");

const apiRouter = require("./routes/api");
const authApiRouter = require("./routes/authApi");

const errorHandlers = require("./handlers/errorHandlers");

const { isValidToken } = require("./controllers/authController");

require("dotenv").config({ path: ".variables.env" });

const app = express();

console.log("Server starting...");

app.use(express.static(__dirname + "public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "hardcoded_secret",
    key: process.env.KEY,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/test" }),
  })
);

app.use((req, res, next) => {
  res.locals.currentPath = req.url;
  next();
});

app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    res.status(204).end();
  } else {
    next();
  }
});

app.use("/api", authApiRouter);
app.use("/api", apiRouter);

app.use(errorHandlers.notFound);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);

module.exports = app;
