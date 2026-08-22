import { db, isFirebaseConfigured } from '../firebaseAdmin.js';

let activeActions = {
  gateBRerouted: false,
  emergencyExit2Open: false,
  securityWall: false
};

export const executeAction = async (req, res) => {
  const { actionType, stateValue } = req.body;
  if (isFirebaseConfigured) {
    try {
      await db.collection('actions').add({
        actionType,
        stateValue,
        timestamp: new Date()
      });
      return res.json({ success: true, message: `Action ${actionType} updated in Firestore` });
    } catch (err) {
      console.warn("Firestore executeAction failed, using mock fallback", err);
    }
  }

  if (actionType in activeActions) {
    activeActions[actionType] = stateValue;
    return res.json({ success: true, message: `Action ${actionType} updated`, state: activeActions });
  }
  res.status(400).json({ success: false, message: 'Invalid action type' });
};

export const getActions = async (req, res) => {
  if (isFirebaseConfigured) {
    try {
      const snapshot = await db.collection('actions').orderBy('timestamp', 'desc').limit(10).get();
      const actions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, data: actions });
    } catch (err) {
      console.warn("Firestore getActions failed, using mock fallback", err);
    }
  }
  res.json({ success: true, data: activeActions });
};
