import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import autoresRoutes from './routes/autores.routes.js';
import { noEncontrado, manejarErrores } from './middlewares/manejarErrores.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/autores', autoresRoutes);

app.use(noEncontrado);
app.use(manejarErrores);

export default app;
