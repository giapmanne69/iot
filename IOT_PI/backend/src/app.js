import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import sensorRoutes from './routes/sensor.route.js';
import actionRoutes from './routes/action.route.js';
import corsOptions from './config/cors.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/sensors', sensorRoutes);
app.use('/api/actions', actionRoutes);

export default app;
