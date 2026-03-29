const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

let events = [];
let clients = [];

app.post('/events', (req, res) => {
  const { type, message, priority } = req.body;

  if (!type || !message || !priority) {
    return res.status(400).json({ error: 'Missing required fields: type, message, priority' });
  }

  if (!['low', 'normal', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be one of: low, normal, high' });
  }

  if (events.length >= 50) {
    let toDrop = events.filter(e => e.priority === 'low').sort((a, b) => a.id - b.id)[0];
    if (!toDrop) {
      toDrop = events.filter(e => e.priority === 'normal').sort((a, b) => a.id - b.id)[0];
    }
    if (!toDrop) {
      return res.status(429).json({ error: 'Buffer full of high-priority events' });
    }
    events = events.filter(e => e !== toDrop);
  }

  const event = { id: Date.now(), type, message, priority };
  events.push(event);

  clients.forEach(client => {
    client.write('data: ' + JSON.stringify(event) + '\n\n');
  });

  res.status(201).json(event);
});

app.get('/events', (req, res) => {
  res.json([...events].sort((a, b) => b.id - a.id));
});

app.get('/events/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});