import { calculateRisk } from '../../src/utils/riskEngine.js';
import { db, isFirebaseConfigured } from '../firebaseAdmin.js';

export const getTelemetry = async (req, res) => {
  if (isFirebaseConfigured) {
    try {
      const docRef = db.collection('telemetry').doc('live');
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        return res.json({ success: true, data: { ...docSnap.data(), timestamp: new Date() } });
      }
    } catch (err) {
      console.warn("Firestore getTelemetry failed, using mock fallback", err);
    }
  }

  const gateCBlocked = req.query.gateCBlocked === 'true';
  const vipSurge = req.query.vipSurge === 'true';
  const gateBRerouted = req.query.gateBRerouted === 'true';
  const emergencyExit2Open = req.query.emergencyExit2Open === 'true';

  const density = gateCBlocked ? 6.8 : vipSurge ? 5.2 : 3.4;
  const flowSpeed = gateCBlocked ? 0.3 : gateBRerouted ? 1.6 : 1.1;
  const blockedGates = gateCBlocked ? 1 : 0;

  const calculatedRisk = calculateRisk({
    density,
    flowSpeed,
    blockedGates,
    vipSurge
  });

  const baseThreat = calculatedRisk;
  const adjustedThreat = baseThreat + (gateBRerouted ? -15 : 0) + (emergencyExit2Open ? -10 : 0);
  const threatLevel = Math.max(12, Math.min(98, Math.round(adjustedThreat)));

  res.json({
    success: true,
    data: {
      density: parseFloat(density.toFixed(1)),
      speed: parseFloat(flowSpeed.toFixed(2)),
      threatLevel,
      headcount: 48000 + Math.round((Math.random() - 0.4) * 40),
      timestamp: new Date()
    }
  });
};

