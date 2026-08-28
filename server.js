const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('JBL API ONLINE - /youtube/play?id=VIDEOID');
});

app.get('/youtube/play', async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send('sem id');
  
  const url = `https://www.youtube.com/watch?v=${id}`;
  
  try {
    const info = await ytdl.getInfo(url, {
      playerClients: ['ANDROID', 'WEB']
    });
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly'
    });
    if (!format || !format.url) {
      return res.status(500).send('Failed to find any playable formats');
    }
    return res.redirect(302, format.url);
  } catch (e) {
    console.error(e);
    return res.status(500).send(`erro: ${e.message}`);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rodando na porta ${PORT}`);
});
