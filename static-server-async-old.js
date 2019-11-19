const http = require("http"); //获取http请求
const url = require("url");
const path = require("path");
const fs = require("fs").promises;
const chalk = require("chalk");
// noinspection NpmUsedModulesInstalled
const mime = require("mime");
const { createReadStream } = require("fs");
class Server {
  constructor({ port, cwd }) {
    this.port = port || 3000;
    this.cwd = cwd || process.cwd();
  }
  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url);
    let filepath = path.join(this.cwd, pathname);
    try {
      let statObj = await fs.stat(filepath);
      if (statObj.isDirectory()) {
        // filepath = path.join(filepath, "index.html");
        // await fs.access(filepath);
      }
      // let content = await fs.readFile(filepath, "utf8");
      // res.end(content);
      // 也可以用流
      this.sendFile(req, res, filepath);
    } catch (e) {
      this.sendError(req, res, e);
    }
  }
  sendFile(req, res, filepath) {
    res.setHeader("Content", mime.getType(filepath) + ";charset=utf-8");
    createReadStream(filepath).pipe(res);
  }
  sendError(req, res, e) {
    console.log(e, "555");
    res.statusCode = 404;
    res.end("Not found");
  }
  start() {
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(`${chalk.yellow("Starting up http-server, serving ./")}
Available on:
http://127.0.0.1:${chalk.green(this.port)}
Hit CTRL-C to stop the server
    `);
    });
  }
}
module.exports = Server;
// http
//   .createServer((req, res) => {
//     let { pathname, query } = url.parse(req.url, true);
//     let absPath = path.join(__dirname, pathname);
//     fs.stat(absPath, (err, stats) => {
//       if (err) {res.statusCode = 404;return res.end()}
//       if (!stats.isFile()) {
//         /**
//          * 如果是文件夹找index
//          * */
//         absPath = path.join(absPath, "index.html");
//         fs.access(absPath, error => {
//           if (error) {res.statusCode = 404; return res.end();
//           }
//         });
//       }
//       //判断是不是文件
//       res.setHeader("Content-type", mime.getType(absPath) + ";charset=utf-8");
//       fs.createReadStream(absPath).pipe(res);
//     });
//   })
//   .listen(3000);
