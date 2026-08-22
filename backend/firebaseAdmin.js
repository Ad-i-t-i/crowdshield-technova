import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let db = null;
let isFirebaseConfigured = false;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (serviceAccountPath || projectId) {
  try {
    const config = {};
    if (serviceAccountPath) {
      // Initialize with service account credentials JSON file path
      config.credential = admin.credential.cert(serviceAccountPath);
    } else {
      // Use application default credentials or projectId fallback
      config.projectId = projectId;
    }
    admin.initializeApp(config);
    db = admin.firestore();
    isFirebaseConfigured = true;
    console.log("🔥 Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Admin SDK failed to initialize:", error);
  }
} else {
  console.warn("⚠️ Firebase Admin SDK config not found in env. Running backend in local/mock database mode.");
}

export { db, isFirebaseConfigured };
