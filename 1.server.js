const http = require("http");
const path = require("path");
const fs = require("fs");

http
  .createServer((req, res) => {
    let { pathname } = require("url").parse(req.url);
    console.log(pathname);
    let absPath = path.join(__dirname, pathname);
    fs.stat(absPath, (err, statObj) => {
      if (err) {
        res.statusCode = 404;
        return res.end("Over");
      }
      if (statObj.isFile()) {
        res.setHeader("Cache-Control", "max-age=10"); //相对时间
        // Cache-Control: 相对时间
        // Expires  绝对时间
        //如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。
        res.setHeader("Expires", new Date(Date.now() + 20 * 1000).toDateString());
        fs.createReadStream(absPath).pipe(res);
      }
    });
  })
  .listen(3000);
