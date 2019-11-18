const http = require("http"); //获取http请求
const url = require("url");
const path = require("path");
const fs = require("fs");
http
  .createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);
    let absPath = path.join(__dirname, pathname);
    fs.stat(absPath, (err, stats) => {
      if (err) {res.statusCode = 404; return res.end()}
      if (stats.isFile()) {
        //判断是不是文件
        fs.createReadStream(absPath).pipe(res);
      }
    });
  })
  .listen(3000);
