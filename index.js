import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const discordWebhookURL = process.env['WEBHOOK_URL'];

app.post('/seed-progress', async (req, res) => {
  const { server, timestamp } = req.body;

  const players = parseInt(server.players, 10) || 0;
  const max = 50;

  const filled = '█'.repeat(Math.min(players, max));
  const empty = '░'.repeat(Math.max(0, max - players));
  const bar = `[${filled}${empty}] ${players}/50`;

  const payload = {
    content: "<@&1315305828622008351> Seed attivo!",
    embeds: [
      {
        title: "⚠️ Seeding in corso!",
        color: 2281737,
        fields: [
          { name: "Server", value: `\`${server.name}\`` },
          { name: "Giocatori", value: `\`\`\`${server.players}/${server.maxPlayers}\`\`\``, inline: true },
          { name: "Mappa", value: `\`\`\`${server.map}\`\`\``, inline: true },
          { name: "Stato Seeding", value: `\`\`\`${bar}\`\`\`` },
          { name: "Orario", value: `${timestamp.date} alle ${timestamp.time}` }
        ],
        footer: { text: "Vi aspettiamo sul server!" },
        image: {
          url: "https://raw.githubusercontent.com/CheesyString/squadita-dashboard/refs/heads/main/Screenshot%202025-06-27%20112042.png"
        }
      }
    ],
    username: "Seed Bot"
  };

  try {
    const response = await fetch(discordWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Discord webhook error:', text);
      return res.status(500).send(text);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Fetch error:', err);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.send('Seed Progress Webhook is Running');
});

app.listen(3000, () => console.log('Listening on port 3000'));
