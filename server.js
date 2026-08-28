const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req,res)=>res.send('JBL V5 OK'));

app.get('/youtube/play', async (req,res)=>{
  const id = req.query.id;
  if(!id) return res.status(400).send('sem id');
  try{
    const body = {
      context: { client: { clientName: "ANDROID", clientVersion: "19.09.37", androidSdkVersion: 30 } },
      videoId: id
    };
    const r = await fetch('https://www.youtube.com/youtubei/v1/player?key=AIzaSyA8eiZmM1Fa_Df1-N8d0yJ3Jq6A', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    const data = await r.json();
    const formats = [...(data.streamingData?.adaptiveFormats||[]),...(data.streamingData?.formats||[])];
    let audio = formats.filter(f=>f.mimeType?.includes('audio')).sort((a,b)=> (b.bitrate||0)-(a.bitrate||0))[0];
    if(!audio?.url && audio?.signatureCipher){
      // precisa decipher, pega outro com url
      audio = formats.find(f=>f.url && f.mimeType?.includes('audio'));
    }
    if(audio?.url){
      console.log("SUCESSO V5: "+id);
      return res.redirect(302, audio.url);
    }
    console.log("SEM URL", JSON.stringify(data).slice(0,500));
    res.status(500).send('sem audio url');
  }catch(e){
    console.log("ERRO V5", e.message);
    res.status(500).send('erro v5: '+e.message);
  }
});
app.listen(PORT,'0.0.0.0',()=>console.log("V5 rodando"));
