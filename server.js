const express = require('express');
const http = require('http');
const expressWs = require('express-ws');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = expressWs(app, server);

const PORT = 3001;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies
app.use(express.static('client/dist'));

app.get('/api/files', async (req, res) => {
    const dirPath = req.query.path || '.';
    try {
        const files = await fs.promises.readdir(dirPath, { withFileTypes: true });
        const fileDetails = files.map(file => ({
            name: file.name,
            isDirectory: file.isDirectory(),
        }));
        res.json(fileDetails);
    } catch (error) {
        res.status(500).send(`Error reading directory: ${error.message}`);
    }
});

app.get('/api/file', async (req, res) => {
    const filePath = req.query.path;
    if (!filePath) {
        return res.status(400).send('File path is required');
    }
    try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        res.send(content);
    } catch (error) {
        res.status(500).send(`Error reading file: ${error.message}`);
    }
});

app.post('/api/file', async (req, res) => {
    const { path, content } = req.body;
    if (!path || content === undefined) {
        return res.status(400).send('File path and content are required');
    }
    try {
        await fs.promises.writeFile(path, content, 'utf-8');
        res.status(200).send('File saved successfully');
    } catch (error) {
        res.status(500).send(`Error saving file: ${error.message}`);
    }
});

app.ws('/ws', (ws, req) => {
    console.log('WebSocket connection established');

    ws.on('message', (msg) => {
        console.log(`Received command: ${msg}`);
        const command = exec(msg.toString());

        command.stdout.on('data', (data) => {
            ws.send(JSON.stringify({ type: 'stdout', data: data.toString() }));
        });

        command.stderr.on('data', (data) => {
            ws.send(JSON.stringify({ type: 'stderr', data: data.toString() }));
        });

        command.on('close', (code) => {
            ws.send(JSON.stringify({ type: 'close', data: `Command exited with code ${code}` }));
        });
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
