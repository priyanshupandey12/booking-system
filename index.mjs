import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.routes.js';
import seatRoutes from './src/routes/seats.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080;

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.use('/api/auth', authRoutes);
app.use('/api', seatRoutes);


app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, error: message });
});

app.listen(port, () => console.log(`Server running on port: ${port}`));