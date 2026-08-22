import { db, isFirebaseConfigured } from '../firebaseAdmin.js';

const statusOptions = ['online', 'online', 'online', 'fault', 'critical'];

export const getSensors = async (req, res) => {
  if (isFirebaseConfigured) {
    try {
      const snapshot = await db.collection('sensors').get();
      if (!snapshot.empty) {
        const sensors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, count: sensors.length, data: sensors });
      }
    } catch (err) {
      console.warn("Firestore getSensors failed, using mock fallback", err);
    }
  }

  const sensors = [];
  for (let i = 1; i <= 24; i++) {
    sensors.push({
      id: `SN-${1000 + i}`,
      zone: i <= 6 ? 'Zone A' : i <= 12 ? 'Zone B' : i <= 18 ? 'Zone C' : 'Zone D',
      status: i === 15 ? 'critical' : statusOptions[Math.floor(Math.random() * statusOptions.length)],
      battery: Math.floor(Math.random() * 40) + 60
    });
  }
  res.json({ success: true, count: sensors.length, data: sensors });
};
