import { db, isFirebaseConfigured } from '../firebaseAdmin.js';

let mockAlerts = [
  { id: '1', zone: 'Zone C: Gate C Bottleneck', severity: 'CRITICAL', message: 'Density exceeded 6.5 p/m²', acknowledged: false, timestamp: new Date() },
  { id: '2', zone: 'Zone B: Central Corridor', severity: 'WARNING', message: 'Crowd influx velocity slowed', acknowledged: false, timestamp: new Date() }
];

export const getAlerts = async (req, res) => {
  if (isFirebaseConfigured) {
    try {
      const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').get();
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, count: alerts.length, data: alerts });
    } catch (err) {
      console.warn("Firestore getAlerts failed, using mock fallback", err);
    }
  }
  res.json({ success: true, count: mockAlerts.length, data: mockAlerts });
};

export const acknowledgeAlert = async (req, res) => {
  const { id } = req.params;
  if (isFirebaseConfigured) {
    try {
      await db.collection('alerts').doc(id).update({ acknowledged: true });
      return res.json({ success: true, message: 'Alert acknowledged in Firestore' });
    } catch (err) {
      console.warn("Firestore acknowledgeAlert failed, using mock fallback", err);
    }
  }
  mockAlerts = mockAlerts.map(a => a.id === id ? { ...a, acknowledged: true } : a);
  res.json({ success: true, message: 'Alert acknowledged' });
};
