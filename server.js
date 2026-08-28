const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

app.get('/youtube/play', async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send('sem id');

    const url = `https://www.youtube.com/watch?v=${id}`;
    try {
        console.log('Tocando:', id);
        const info = await ytdl.getInfo(url);
        // pega só audio mp3
        const format = ytdl.chooseFormat(info.formats, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
        });
        
        if (!format || !format.url) {
            return res.status(404).send('sem audio');
        }

        // redireciona pro link direto do googlevideo (MTA toca direto)
        res.redirect(format.url);
    } catch (e) {
        console.error(e);
        res.status(500).send('erro: ' + e.message);
    }
});

app.get('/', (req, res) => {
    res.send('JBL API ONLINE - Use /youtube/play?id=VIDEOID');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API JBL rodando na porta ' + PORT));