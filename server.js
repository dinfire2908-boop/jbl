const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const PIPED_SERVERS = [
  "https://api.piped.private.coffee",
  "https://pipedapi.kavin.rocks",
  "https://api.piped.privacydev.net",
  "https://pipedapi.moomoo.me"
];

app.get('/', (req,res)=> res.send('JBL API V3 - PIPED'));

app.get('/youtube/play', async (req, res) => {
  const id = req.query.id;
  if(!id) return res.status(400).send('sem id');
  console.log("PEDIDO: "+id);

  for(let server of PIPED_SERVERS){
    try{
      console.log("Tentando "+server);
      const r = await fetch(`${server}/streams/${id}`);
      if(!r.ok) continue;
      const data = await r.json();
      let audio = data.audioStreams?.sort((a,b)=>b.bitrate - a.bitrate)[0];
      if(audio?.url){
        console.log("SUCESSO em "+server);
        return res.redirect(302, audio.url);
      }
    }catch(e){ console.log("Falha "+server+": "+e.message); }
  }
  console.log("TODOS FALHARAM");
  res.status(500).send('todos falharam');
});

app.listen(PORT, '0.0.0.0', ()=> console.log(`Rodando ${PORT}`));
