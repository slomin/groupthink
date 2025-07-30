
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error.message);
  // Return a 500 error if initialization fails
  module.exports = (req, res) => {
    res.status(500).send('Firebase Admin SDK could not be initialized.');
  };
  // Exit if not in a serverless function context (e.g., during build)
  if (typeof module.exports !== 'function') {
    return;
  }
}

const db = admin.firestore();

const getInitialSessionState = () => ({
    moderator: null,
    participants: {},
    taskName: '',
    votesRevealed: false,
    lastReset: Date.now()
});

module.exports = async (req, res) => {
  // Secure the endpoint with a secret token
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const appId = 'groupthink-app';
    const sessionDocRef = db.doc(`/artifacts/${appId}/public/data/poker_sessions/current_session`);
    
    await sessionDocRef.set(getInitialSessionState());
    
    console.log('Session reset successfully.');
    res.status(200).send('Session reset successfully.');
  } catch (error) {
    console.error('Error resetting session:', error);
    res.status(500).send('Error resetting session.');
  }
};
