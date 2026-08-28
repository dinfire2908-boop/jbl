const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const APIS = ["https://api.piped.private.coffee","https://pipedapi.kavin.rocks","https://api.piped.privacydev.net","https://pipedapi.adminforge.de"];
app.get('/',(req,res)=>res.send('JBL V4 OK'));
app.get('/youtube/play',async(req,res)=>{
  const id=req.query.id;
  if(!id) return res.status(400).send('sem id');
  for(const base of APIS){
    try{
      const r=await fetch(`${base}/streams/${id}`,{signal:AbortSignal.timeout(8000)});
      const data=await r.json();
      const audio=data.audioStreams?.sort((a,b)=>b.bitrate-a.bitrate)[0];
      if(audio?.url) return res.redirect(302,audio.url);
    }catch(e){}
  }
  res.status(500).send('erro 429 todas falharam');
});
app.listen(PORT,'0.0.0.0',()=>console.log("V4 rodando"));
