import express from 'express';
import cors from 'cors';
import incidentRoutes from './routes/incidentRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import zoneRoutes from './routes/zoneRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import actionRoutes from './routes/actionRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/incidents', incidentRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/sensors', sensorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MERN Backend Service Running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`⚡ CrowdShield Nexus MERN Backend listening on port ${PORT}`);
});

