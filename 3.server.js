const http = require('http');
const path = require('path');
const fs = require('fs');
http.createServer((req,res)=>{
  let {pathname} = require('url').parse(req.url);
  console.log(pathname)
  let absPath = path.join(__dirname,pathname);
  fs.stat(absPath,(err,statObj)=>{
    if(err){
      res.statusCode = 404;
      res.end();
      return ;
    }
    if(statObj.isFile()){
      // no-store 表示的是不缓存
      // no-cache 缓存但是每次都像服务器发请求
      let clientHeader = req.headers['if-modified-since'];
      if(clientHeader){ // 第二次来
        let currentFileCtime = statObj.ctime.toGMTString();
        if(clientHeader === currentFileCtime){
          res.statusCode = 304;
          res.end(); // 没有返回文件中的内容
          return;
        }
      }
      res.setHeader('Cache-Control','no-cache');
      res.setHeader('Last-Modified',statObj.ctime.toGMTString());
      fs.createReadStream(absPath).pipe(res);
    }
  })
}).listen(4000);
