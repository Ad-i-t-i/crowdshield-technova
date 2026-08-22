import { db, isFirebaseConfigured } from '../firebaseAdmin.js';

export const getZones = async (req, res) => {
  if (isFirebaseConfigured) {
    try {
      const snapshot = await db.collection('zones').get();
      if (!snapshot.empty) {
        const zones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ success: true, data: zones });
      }
    } catch (err) {
      console.warn("Firestore getZones failed, using mock fallback", err);
    }
  }

  const gateCBlocked = req.query.gateCBlocked === 'true';
  const data = [
    { id: 'Zone A', name: 'Zone A: North Plaza', density: 1.4, color: 'rgba(174, 220, 192, 0.25)', border: '#AEDCC0' },
    { id: 'Zone B', name: 'Zone B: Central Corridor', density: 3.8, color: 'rgba(252, 211, 77, 0.25)', border: '#FCD34D' },
    { id: 'Zone C', name: 'Zone C: Gate C Bottleneck', density: gateCBlocked ? 6.8 : 4.2, color: gateCBlocked ? 'rgba(255, 139, 148, 0.35)' : 'rgba(251, 146, 60, 0.25)', border: gateCBlocked ? '#FF8B94' : '#FB923C' },
    { id: 'Zone D', name: 'Zone D: West Entry', density: 1.8, color: 'rgba(168, 216, 234, 0.25)', border: '#A8D8EA' }
  ];
  res.json({ success: true, data });
};
