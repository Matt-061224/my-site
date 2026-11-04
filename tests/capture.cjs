const fs=require('node:fs');
(async()=>{
 const targets=await(await fetch('http://127.0.0.1:9222/json')).json();const target=targets.find(x=>x.type==='page');
 const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const jobs=new Map();
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const j=jobs.get(m.id);jobs.delete(m.id);m.error?j.reject(m.error):j.resolve(m.result)}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{jobs.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
 await send('Page.enable');
 for(const [name,width,height] of [['index',1440,1000],['quotes',1440,1000],['project',1440,1000],['machine',1440,1000],['machine',390,844]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<500});
 await send('Page.navigate',{url:`file:///C:/Users/HuangYC/Desktop/web/web-projects/my-site/${name}.html`});
 await new Promise(r=>setTimeout(r,400));
 const check=await send('Runtime.evaluate',{expression:'JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth,cards:document.querySelectorAll(".memory-card").length})',returnByValue:true});console.log(name,width,check.result.value);
 const metrics=await send('Page.getLayoutMetrics');
 const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:metrics.cssContentSize.height,scale:1}});
 fs.writeFileSync(`screenshots/${name}-${width}.png`,Buffer.from(shot.data,'base64'));
 }
 await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exitCode=1});
