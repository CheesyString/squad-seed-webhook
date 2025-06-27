import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const discordWebhookURL = process.env['WEBHOOK_URL'];

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.post('/seed-progress', async (req, res) => {
  const { players, maxPlayers, map } = req.body;

  if (!players || !maxPlayers || !map) {
    console.error('❌ Missing required data:', req.body);
    return res.status(400).send('Missing required fields');
  }

  const playerCount = parseInt(players, 10) || 0;
  const max = 50;

  const filled = '█'.repeat(Math.min(playerCount, max));
  const empty = '░'.repeat(Math.max(0, max - playerCount));
  const bar = `[${filled}${empty}] ${playerCount}/50`;

  const message = [
    'Seed attivo!',
    '',
    `🗺️ Mappa: \`${map}\``,
    `👥 Giocatori: \`${playerCount}/${maxPlayers}\``,
    '',
    `📊 Stato Seeding:\n${bar}`,
    '',
    'Vi aspettiamo sul server!'
  ].join('\n');

  try {
    const response = await fetch(discordWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message, username: 'Seed Bot' })
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('❌ Discord webhook error:', text);
      return res.status(500).send(text);
    }

    console.log('✅ Plain message sent to Discord');
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.send('Seed Progress Webhook is Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Listening on port ${PORT}`));
