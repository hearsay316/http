const http = require("http"); // 导入http
const fs = require("fs"); // 导入fs
http.createServer((req, res) => {
  
  if(req.url=="/api"){
    let obj = {
      coding:200,
      name:"刘楚",
      age:"19"
    };
    console.log(req.url);
    res.end(JSON.stringify(obj))
  }
  if(req.url=="/liuchushishadiao"){
    let Conent =  fs.readFileSync("static/index.html","utf8");
    res.end(Conent)
  }
}).listen(3000);
//http://localhost:3000/api
