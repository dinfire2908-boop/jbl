const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
app.get('/', (req,res)=>res.send('JBL V6 OK - SEM 429'));
app.get('/youtube/play', async (req,res)=>{
  const id=req.query.id;
  if(!id) return res.status(400).send('sem id');
  try{
    // Metodo 1: YouTube Android
    const r = await fetch('https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8',{
      method:'POST',
      headers:{'Content-Type':'application/json','User-Agent':'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip'},
      body: JSON.stringify({videoId:id, context:{client:{clientName:"ANDROID",clientVersion:"19.09.37",androidSdkVersion:30}}})
    });
    const j = await r.json();
    const fmts = [...(j.streamingData?.adaptiveFormats||[]),...(j.streamingData?.formats||[])];
    const audio = fmts.filter(f=>f.mimeType&&f.mimeType.includes('audio')).sort((a,b)=>(b.bitrate||0)-(a.bitrate||0))[0];
    if(audio?.url){
      console.log("V6 OK "+id);
      return res.redirect(302, audio.url);
    }
    console.log("FALHA V6 sem url");
    return res.status(500).json(j);
  }catch(e){
    console.log("ERRO V6 "+e.message);
    res.status(500).send(e.message);
  }
});
app.listen(PORT,'0.0.0.0',()=>console.log("V6 ON"));
