import express from 'express';
import cors from 'cors';
import { noEncontrado, manejarErrores } from './middlewares/manejarErrores.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use(noEncontrado);
app.use(manejarErrores);

export default app;
