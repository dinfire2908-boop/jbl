const express = require('express');
const app = express();

app.get('/', (req,res)=> res.send('OK V7.3'));

app.get('/youtube/play', async (req,res)=>{
  try{
    const id = req.query.id;
    const r = await fetch('https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({videoId:id, context:{client:{clientName:'ANDROID', clientVersion:'20.07.34'}}})
    });
    const j = await r.json();
    const url = j.streamingData?.adaptiveFormats?.find(f=>f.mimeType?.includes('audio'))?.url;
    if(!url) return res.status(500).send('sem audio');
    res.redirect(url);
  }catch(e){ res.status(500).send(e.message) }
});

app.listen(process.env.PORT||3000);
