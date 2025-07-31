const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "usersdb"
});

db.connect();

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
    (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        res.send("Login successful");
      } else {
        res.send("Invalid credentials");
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
