import { db, isFirebaseConfigured } from '../firebaseAdmin.js';

let mockIncidents = [
  { id: '1', title: 'Gate C Bottleneck Jam', sector: 'Sector 3', details: 'Crowd crush risk high', timestamp: new Date(), status: 'ACTIVE' }
];

export const getIncidents = async (req, res) => {
  if (isFirebaseConfigured) {
    try {
      const snapshot = await db.collection('incidents').orderBy('timestamp', 'desc').get();
      const incidents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, count: incidents.length, data: incidents });
    } catch (err) {
      console.warn("Firestore getIncidents failed, using mock fallback", err);
    }
  }
  res.json({ success: true, count: mockIncidents.length, data: mockIncidents });
};

export const createIncident = async (req, res) => {
  const { title, sector, details } = req.body;
  if (isFirebaseConfigured) {
    try {
      const newInc = {
        title: title || 'Reported Incident',
        sector: sector || 'Sector 1',
        details: details || '',
        timestamp: new Date(),
        status: 'ACTIVE'
      };
      const docRef = await db.collection('incidents').add(newInc);
      return res.status(201).json({ success: true, data: { id: docRef.id, ...newInc } });
    } catch (err) {
      console.warn("Firestore createIncident failed, using mock fallback", err);
    }
  }

  const newIncident = {
    id: Date.now().toString(),
    title: title || 'Reported Incident',
    sector: sector || 'Sector 1',
    details: details || '',
    timestamp: new Date(),
    status: 'ACTIVE'
  };
  mockIncidents.push(newIncident);
  res.status(201).json({ success: true, data: newIncident });
};
