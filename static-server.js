const http = require("http"); //获取http请求
const url = require("url");
const path = require("path");
const fs = require("fs");
// noinspection NpmUsedModulesInstalled
const mime = require("mime");
http
  .createServer((req, res) => {
    let { pathname, query } = url.parse(req.url, true);
    let absPath = path.join(__dirname, pathname);
    fs.stat(absPath, (err, stats) => {
      if (err) {res.statusCode = 404; console.log(err);return res.end()}
      if (!stats.isFile()) {
        /**
         * 如果是文件夹找index
         * */
        absPath = path.join(absPath, "index.html");
        fs.access(absPath, error => {
          if (error) {res.statusCode = 404; return res.end();
          }
        });
      }
      //判断是不是文件
      res.setHeader("Content-type", mime.getType(absPath) + ";charset=utf-8");
      fs.createReadStream(absPath).pipe(res);
    });
  })
  .listen(3000);
