const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const musicard = require('musicard');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        try {
            const { title, artist, album, duration, position } = JSON.parse(message);

            if (!title || !artist || !album || !duration || !position) {
                return ws.send(JSON.stringify({ error: 'Missing required fields' }));
            }

            const card = musicard({
                title,
                artist,
                album,
                duration,
                position
            });

            const outputPath = path.join(__dirname, 'output', 'music_card.png');
            await card.write(outputPath);

            const imageBuffer = fs.readFileSync(outputPath);
            ws.send(imageBuffer.toString('base64'));
        } catch (error) {
            console.error(error);
            ws.send(JSON.stringify({ error: 'Failed to generate card' }));
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
