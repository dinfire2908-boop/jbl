const express = require('express');
const app = express();

const INVIDIOUS = [
  'https://iv.ggtyler.dev',
  'https://invidious.nerdvpn.de',
  'https://inv.nadeko.net'
];

app.get('/', (req,res)=> res.send('JBL V7.4 ANTI-BLOQUEIO ON'));

app.get('/youtube/play', async (req,res)=>{
  const id = req.query.id;
  if(!id) return res.status(400).send('sem id');
  const ytUrl = `https://www.youtube.com/watch?v=${id}`;

  // TENTATIVA 1: COBALT - O MAIS FORTE HOJE
  try {
    const r = await fetch('https://co.wuk.sh/api/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ url: ytUrl, aFormat: 'mp3', isAudioOnly: true })
    });
    const j = await r.json();
    if(j.url){ console.log('COBALT OK'); return res.redirect(j.url); }
  } catch(e){ console.log('Cobalt falhou', e.message); }

  // TENTATIVA 2: YOUTUBEI IOS (bypass do video unavailable)
  try {
    const body = {
      videoId: id,
      context: { client: { clientName: 'IOS', clientVersion: '19.29.1', deviceModel: 'iPhone16,2' } },
      contentCheckOk: true, racyCheckOk: true
    };
    const r = await fetch('https://www.youtube.com/youtubei/v1/player?key=AIzaSyB-63vPrdThhK283AIVY_Gjt3HtVoFZg', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    const j = await r.json();
    const url = j.streamingData?.adaptiveFormats?.find(f=>f.mimeType?.includes('audio'))?.url || j.streamingData?.formats?.[0]?.url;
    if(url){ console.log('IOS OK'); return res.redirect(url); }
  } catch(e){ console.log('IOS falhou'); }

  // TENTATIVA 3: INVIDIOUS
  for(const inv of INVIDIOUS){
    try{
      const r = await fetch(`${inv}/latest_version?id=${id}&itag=140&local=true`, { redirect: 'manual' });
      if(r.status===302 && r.headers.get('location')) return res.redirect(r.headers.get('location'));
    }catch(e){}
  }

  res.status(500).send('Video unavailable - YouTube bloqueou o IP, tenta de novo em 10s');
});

app.listen(process.env.PORT||3000, ()=>console.log('V7.4 ON'));
