import express from 'express';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

app.post('/seed-progress', (req, res) => {
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Seed Progress Webhook is Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
