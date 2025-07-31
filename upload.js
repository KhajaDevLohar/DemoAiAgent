const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "uploads", req.file.originalname);

  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      res.send("Something went wrong");
    } else {
      res.send("File uploaded successfully");
    }
  });
});

app.listen(3000);
