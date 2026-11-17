import 'dotenv/config';
import express from 'express';
import { apiRouter } from './routes/api.ts';

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRouter);

app.get('/', (_req, res) => {
  res.json({ service: 'Electro Tecno Backend API', status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Electro Tecno Backend API corriendo en http://0.0.0.0:${port}`);
});
