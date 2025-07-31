const http = require("http");
const fs = require("fs");

const port = 3000;

http
  .createServer((req, res) => {
    if (req.url === "/") {
      fs.readFile("index.html", (err, data) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    } else {
      res.writeHead(404);
      res.write("Page Not Found");
      res.end();
    }
  })
  .listen(port);

console.log("Server started at port " + port);
