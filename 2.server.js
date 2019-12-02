const http = require("http");
const path = require("path");
const fs = require("fs");
http.createServer((req, res) => {
    let { pathname } = require("url").parse(req.url);
    //   console.log(pathname);
    let absPath = path.join(__dirname, pathname);
    fs.stat(absPath, (err, statObj) => {
      if (err) {
        res.statusCode = 404;
         res.end("Over");
        return
      }
      if (statObj.isFile()) {
        //  console.log(req.headers)
        //
        let clientHeader = req.headers["if-modified-since"];
        if (clientHeader) {
          let currentFileCtime = statObj.ctime.toLocaleString();
          console.log(clientHeader === currentFileCtime);
          if (clientHeader === currentFileCtime) {
            res.statusCode = 304;
            res.end();
            console.log(8888888888)
            return;
          }
        }
        // console.log(req.headers,req.headers["if-modified-since"],6666,statObj.ctime.toISOString());
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Last-Modified", statObj.ctime.toLocaleString());
        // no-store 不缓存 no-cache 不缓存
        fs.createReadStream(absPath).pipe(res);
      }
    });
  })
  .listen(8080);
