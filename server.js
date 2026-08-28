const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req,res)=> res.send('JBL API V2 - PIPED'));

app.get('/youtube/play', async (req, res) => {
  const id = req.query.id;
  if(!id) return res.status(400).send('sem id');

  try {
    console.log("Tocando: "+id);
    // Usa Piped para pegar o áudio - não é bloqueado
    const pipedRes = await fetch(`https://api.piped.private.coffee/streams/${id}`);
    if(!pipedRes.ok) throw new Error('piped falhou '+pipedRes.status);
    const data = await pipedRes.json();

    // Pega o melhor áudio
    let audio = data.audioStreams?.sort((a,b)=>b.bitrate - a.bitrate)[0];
    if(!audio ||!audio.url) throw new Error('sem audio no piped');

    console.log("OK - redirecionando: "+audio.url.substring(0,50));
    return res.redirect(302, audio.url);

  } catch(e) {
    console.error("Erro piped:", e.message);
    // fallback tenta outra instancia piped
    try {
      const piped2 = await fetch(`https://pipedapi.kavin.rocks/streams/${id}`);
      const data2 = await piped2.json();
      let audio2 = data2.audioStreams?.sort((a,b)=>b.bitrate - a.bitrate)[0];
      if(audio2?.url) return res.redirect(302, audio2.url);
    } catch(e2){}

    return res.status(500).send('falhou: '+e.message);
  }
});

app.listen(PORT, '0.0.0.0', ()=> console.log(`API JBL rodando na porta ${PORT}`));
});
