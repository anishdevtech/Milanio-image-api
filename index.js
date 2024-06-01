const express = require('express');
const bodyParser = require('body-parser');
const musicard = require('musicard');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.post('/generate-card', async (req, res) => {
    const { title, artist, album, duration, position } = req.body;

    if (!title || !artist || !album || !duration || !position) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const card = musicard({
            title,
            artist,
            album,
            duration,
            position
        });

        const outputPath = path.join(__dirname, 'output', 'music_card.png');
        await card.write(outputPath);

        res.sendFile(outputPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate card' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
