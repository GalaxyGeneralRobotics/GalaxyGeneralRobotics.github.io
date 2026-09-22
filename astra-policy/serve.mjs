import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.REPORT_PORT || 4178);
const host = process.env.REPORT_HOST || '0.0.0.0';
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.csv':'text/csv; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.mp4':'video/mp4','.webm':'video/webm','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.pdf':'application/pdf','.zip':'application/zip'};

http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let filename = path.resolve(root,'.'+pathname);
    if (filename !== root && !filename.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
    let stat = await fs.promises.stat(filename);
    if (stat.isDirectory()) {filename=path.join(filename,'index.html');stat=await fs.promises.stat(filename);}
    if (!stat.isFile()) {res.writeHead(404);res.end();return;}
    const headers = {'Content-Type':types[path.extname(filename).toLowerCase()]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    let start=0,end=stat.size-1,status=200;
    if (req.headers.range) {
      const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!range||(!range[1]&&!range[2])) {res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
      if (range[1]) {start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;}
      else start=Math.max(0,stat.size-Number(range[2]));
      if (!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=stat.size) {res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    res.writeHead(status,headers);
    if (req.method==='HEAD'||stat.size===0) {res.end();return;}
    const stream=fs.createReadStream(filename,{start,end});
    stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  } catch(error) {
    if (!res.headersSent) res.writeHead(error.code==='ENOENT'?404:400);
    res.end();
  }
}).listen(port,host,()=>{
  console.log(`Report: http://localhost:${port}/index.html?lang=zh&view=1`);
  console.log(`Listening on ${host}:${port}`);
});
