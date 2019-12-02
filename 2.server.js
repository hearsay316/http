const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
http
  .createServer((req, res) => {
    let { pathname } = require("url").parse(req.url);
    //   console.log(pathname);
    let absPath = path.join(__dirname, pathname);
    fs.stat(absPath, (err, statObj) => {
      if (err) {
        res.statusCode = 404;
        res.end("Over");
        return;
      }
      if (statObj.isFile()) {
        
        res.setHeader("Cache-Control", "no-cache");
        let fileContent = fs.readFileSync(absPath,"utf8");
        let md5 = crypto.createHash("md5").update(fileContent).digest("base64");
        res.setHeader("Etag",md5);
        fs.createReadStream(absPath).pipe(res);
      }
    });
  })
  .listen(8080);
