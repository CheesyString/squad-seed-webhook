import express from 'express';

const app = express();
app.use(express.json());

app.post('/seed-progress', (req, res) => {
  console.log('Incoming webhook body:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Seed Progress Webhook is Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
