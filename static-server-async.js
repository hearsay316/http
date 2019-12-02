const http = require("http"); //获取http请求
const url = require("url");
const path = require("path");
const fs = require("fs").promises;
const chalk = require("chalk");
// noinspection NpmUsedModulesInstalled
const mime = require("mime");
const { createReadStream, readFileSync, constants } = require("fs");
const ejs = require("ejs");
const template = readFileSync(path.resolve(__dirname, "template.html"), "utf8");
class Server {
  constructor({ port, cwd, index }) {
    this.port = port || 3000;
    this.cwd = cwd || process.cwd();
    this.template = template;
    this.index = index || "index.html";
  }
  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url);
    pathname = decodeURIComponent(pathname);
    let filepath = path.join(this.cwd, pathname);
    console.log(filepath)
    try {
      let statObj = await fs.stat(filepath);
      if (statObj.isDirectory()) {
        let filepathIndex = path.join(filepath, this.index);
        await fs.access(filepathIndex, constants.F_OK);
        this.sendFile(req, res, filepathIndex);
      } else {
        this.sendFile(req, res, filepath);
      }
      // let content = await fs.readFile(filepath, "utf8");
      // res.end(content);
      // 也可以用流
    } catch (e) {
      // console.log(e);
      if (e.path.includes(this.index)) {
        let dist = await fs.readdir(filepath);
        let str = ejs.render(this.template, {
          arr: dist,
          currentPath: pathname === "/" ? "" : pathname
        });
        res.setHeader("Content-Type", "text/html;charset=utf-8");
        res.end(str);
      } else {
        this.sendError(req, res, e);
      }
    }
  }
  sendFile(req, res, filepath) {
  //  console.log(filepath, "属性", mime.getType(filepath));
    res.setHeader("Content-Type", mime.getType(filepath) + ";charset=utf-8");
    createReadStream(filepath).pipe(res);
  }
  sendError(req, res, e) {
  //  console.log(e, "555");
    res.statusCode = 404;
    res.end(JSON.stringify(e));
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
    server.on("error", err => {
      // console.log(err,66666666)
      if (err.code === "EADDRINUSE") {
        ++this.port;
        this.start();
      }
    });
  }
}
module.exports = Server;
// 304 缓存 http 缓存
//  强制缓存  协商缓存
