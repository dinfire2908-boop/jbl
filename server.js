const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>{
  res.send('JBL V7 OK - SEM 429 - FUNCIONANDO');
});

app.get('/youtube/play', async (req,res)=>{
  const id = req.query.id;
  if(!id) return res.status(400).send('sem id');
  try {
    const r = await fetch(`https://pipedapi.kavin.rocks/streams/${id}`);
    const data = await r.json();
    const audio = data.audioStreams.sort((a,b)=>a.bitrate-b.bitrate)[0];
    if(!audio) return res.status(404).send('sem audio');
    res.redirect(audio.url);
  } catch(e){
    res.redirect(`https://inv.tux.pizza/latest_version?id=${id}&itag=140`);
  }
});

app.listen(PORT, ()=>console.log('JBL V7 ON'));
